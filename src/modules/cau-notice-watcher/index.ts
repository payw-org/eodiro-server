import { prisma } from '@/modules/prisma'
import Push, { PushInformation } from '@/modules/push'
import appRoot from 'app-root-path'
import chalk from 'chalk'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import { PendingXHR } from 'pending-xhr-puppeteer'
import puppeteer, { Browser, Page } from 'puppeteer'

export type TitleBuilder = (
  /** A single notice item */ noticeItemElement: HTMLElement | Element
) => string

export type UrlBuilder = (
  /** A single notice item */ noticeItemElement: HTMLElement | Element
) => string

export type FeedOptions = {
  /**
   * Minutes
   * @default 10
   */
  interval?: number
}

export interface Publisher {
  /** Notice name which will be displayed on the end users */
  name: string
  /** Unique key(id) for differentiating each subscriber */
  key: string
  url: string
  /** A CSS selector of */
  noticeItemSelector: string
  titleBuilder: TitleBuilder
  urlBuilder?: UrlBuilder
}

export type PublisherBuilder = (siteInformation: {
  name: string
  key: string
  url: string
}) => Publisher
export type LastNotice = Record<
  string,
  {
    displayName: string
    title: string
  }
>

const eodiroTempDir = appRoot.resolve('/.eodiro')
const lastNoticeFilePath = appRoot.resolve('/.eodiro/last_notice.json')

export class CauNoticeWatcher {
  private feedOptions: FeedOptions
  private publishers: Publisher[] = []
  private lastNotice: LastNotice

  constructor(feedOptions?: FeedOptions) {
    if (!feedOptions) {
      feedOptions = {
        interval: 10,
      }
    } else if (!feedOptions?.interval) {
      feedOptions.interval = 10
    }

    this.feedOptions = feedOptions
    this.lastNotice = CauNoticeWatcher.loadLastNoticeFile()
  }

  public register(publisher: Publisher): void {
    for (const registeredSubscriber of this.publishers) {
      if (registeredSubscriber.key === publisher.key) {
        throw new Error(
          `${chalk.blueBright(
            '[Notice Watcher]'
          )} Duplicate subscriber key detected: ${publisher.key}`
        )
      }
    }
    this.publishers.push(publisher)

    if (!this.lastNotice[publisher.key]) {
      this.lastNotice[publisher.key] = {
        displayName: publisher.name,
        title: '',
      }
    }
  }

  /**
   * Get the `last_notice.json` file inside '.eodiro' directory
   */
  public static loadLastNoticeFile(): LastNotice {
    let lastNotice: LastNotice

    if (!fs.existsSync(eodiroTempDir)) {
      fs.mkdirSync(eodiroTempDir)
    }

    if (!fs.existsSync(lastNoticeFilePath)) {
      lastNotice = {}
      fs.writeFileSync(lastNoticeFilePath, JSON.stringify(lastNotice, null, 2))
    } else {
      lastNotice = JSON.parse(fs.readFileSync(lastNoticeFilePath, 'utf8'))
    }

    return lastNotice
  }

  private writeLastNoticeFile() {
    fs.writeFileSync(
      lastNoticeFilePath,
      JSON.stringify(this.lastNotice, null, 2)
    )
  }

  private getLastNoticeTitle(publisher: Publisher) {
    return this.lastNotice[publisher.key].title
  }

  private updateLastNotice(publisher: Publisher, title: string) {
    this.lastNotice[publisher.key] = {
      displayName: publisher.name,
      title,
    }
  }

  public async run(): Promise<void> {
    const browser = await puppeteer.launch()

    const processResults = []

    for (const subscriber of this.publishers) {
      processResults.push(this.processPublisher(browser, subscriber))
    }

    await Promise.all(processResults)

    // Dispose the browser
    await browser.close()
  }

  private async processPublisher(browser: Browser, publisher: Publisher) {
    const page = await browser.newPage()

    page.setViewport({ width: 1280, height: 800 })

    // page.setMaxListeners(Infinity)

    const noticesSet = await CauNoticeWatcher.visit(page, publisher).catch(
      (err) => {
        console.error(err)
        process.exit()
      }
    )
    const notices = Array.from(noticesSet)

    if (notices.length === 0) {
      return
    }

    // Get subscriptions
    const subscriptions = await prisma.noticeNotificationsSubscription.findMany(
      {
        where: {
          noticeKey: publisher.key,
        },
        select: {
          user: {
            select: {
              pushes: {
                select: {
                  expoPushToken: true,
                },
              },
            },
          },
        },
      }
    )

    const expoPushTokens = subscriptions
      .map((sub) => sub.user.pushes.map((push) => push.expoPushToken))
      .flat()

    const shouldSendPush = expoPushTokens.length > 0

    const lastNoticeIndex = notices.findIndex(
      (notice) => notice.title === this.getLastNoticeTitle(publisher)
    )

    const pushes: PushInformation[] = []

    if (lastNoticeIndex > 0) {
      for (let i = lastNoticeIndex - 1; i >= 0; i -= 1) {
        const notice = notices[i]

        console.info(`\n새로운 ${publisher.name} 공지사항이 올라왔습니다.`)
        console.info(notices[i])

        if (shouldSendPush) {
          const pushInformation: PushInformation = {
            to: expoPushTokens,
            title: `새로운 ${publisher.name} 공지사항이 올라왔습니다.`,
            body: notice.title,
            data: {
              type: 'notice',
              url: notice.noticeItemUrl,
            },
            sound: 'default',
            _displayInForeground: true,
          }

          pushes.push(pushInformation)
        }
      }
    } else {
      console.info(`${publisher.name}: there is no new notice`)
    }

    if (shouldSendPush) {
      const results = await Push.notify(pushes)
    }

    await page.close()
    this.updateLastNotice(publisher, notices[0].title)
    this.writeLastNoticeFile()
  }

  static async visit(
    page: Page,
    publisher: Publisher,
    pageNumber?: number
  ): Promise<
    {
      title: string
      noticeItemUrl: string
    }[]
  > {
    const pendingXHR = new PendingXHR(page)

    try {
      await page.goto(publisher.url)
      await pendingXHR.waitForAllXhrFinished()
      await page.waitForSelector(publisher.noticeItemSelector)
    } catch (err) {
      throw new Error(err)
    }

    const bodyHtml = await page.$eval('body', (body) => body.innerHTML)

    const { body } = new JSDOM(bodyHtml).window.document

    const notices: {
      title: string
      noticeItemUrl: string
    }[] = []
    const noticeElms = body.querySelectorAll(publisher.noticeItemSelector)

    for (const noticeElm of Array.from(noticeElms)) {
      const title = publisher.titleBuilder(noticeElm)
      const noticeItemUrl = publisher.urlBuilder
        ? publisher.urlBuilder(noticeElm)
        : publisher.url

      notices.push({
        title,
        noticeItemUrl,
      })
    }

    return notices
  }
}
