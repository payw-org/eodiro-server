import puppeteer, { Page } from 'puppeteer'

import EodiroMailer from '../eodiro-mailer'
import { JSDOM } from 'jsdom'
import { PendingXHR } from 'pending-xhr-puppeteer'
import Push from '../push'
import appRoot from 'app-root-path'
import chalk from 'chalk'
import config from '@/config'
import fs from 'fs'
import { isDev } from '../utils/is-dev'
import prisma from '../prisma'

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

export interface Subscriber {
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

export type LastNotice = Record<
  string,
  {
    displayName: string
    title: string
  }
>

const lastNoticeFilePath = appRoot.resolve('/.eodiro/last_notice.json')

export class CauNoticeWatcher {
  private feedOptions: FeedOptions
  private subscribers: Subscriber[] = []
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
    this.lastNotice = this.loadLastNoticeFile()
  }

  public subscribe(subscriber: Subscriber): void {
    for (const registeredSubscriber of this.subscribers) {
      if (registeredSubscriber.key === subscriber.key) {
        throw new Error(
          `${chalk.blueBright(
            '[Notice Watcher]'
          )} Duplicate subscriber key detected: ${subscriber.key}`
        )
      }
    }
    this.subscribers.push(subscriber)

    if (!this.lastNotice[subscriber.key]) {
      this.lastNotice[subscriber.key] = {
        displayName: subscriber.name,
        title: '',
      }
    }
  }

  /**
   * Get the `last_notice.json` file inside '.eodiro' directory
   */
  public loadLastNoticeFile(): LastNotice {
    let lastNotice: LastNotice

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

  private getLastNoticeTitle(subscriber: Subscriber) {
    return this.lastNotice[subscriber.key].title
  }

  private updateLastNotice(subscriber: Subscriber, title: string) {
    this.lastNotice[subscriber.key] = {
      displayName: subscriber.name,
      title,
    }
  }

  public async run(): Promise<void> {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    page.setMaxListeners(Infinity)

    page.setViewport({
      width: 1280,
      height: 800,
    })

    for (const subscriber of this.subscribers) {
      await this.processSubscriber(page, subscriber)
    }

    // Dispose the page and the browser
    await page.close()
    await browser.close()
  }

  /**
   * Send an Email to all subscribed users
   *
   * @deprecated Send App push instead
   */
  private sendMail(subject: string, body: string, subscriber: Subscriber) {
    const emailAddrs = ['io@jhaemin.com']

    return emailAddrs.map((address) => {
      return EodiroMailer.sendMail({
        from: `"[어디로 알림] ${subscriber.name}" <notification@eodiro.com>`,
        to: address,
        subject,
        html: body,
      })
    })
  }

  private async processSubscriber(page: Page, subscriber: Subscriber) {
    const notices = Array.from(await this.visit(page, subscriber))

    if (notices.length === 0) {
      return
    }

    const lastNoticeIndex = notices.indexOf(this.getLastNoticeTitle(subscriber))

    if (lastNoticeIndex > 0) {
      for (let i = lastNoticeIndex - 1; i >= 0; i--) {
        if (isDev()) {
          console.log(`새로운 ${subscriber.name} 공지사항이 올라왔습니다.`)
          console.log(notices[i])
        }

        // Push Notifications
        const subscriptionsInfo = await prisma.noticeNotificationsSubscription.findMany(
          {
            where: {
              noticeKey: subscriber.key,
            },
            include: {
              user: {
                select: {
                  devices: true,
                },
              },
            },
          }
        )

        const pushTokens = subscriptionsInfo.reduce(
          (accum, curr) => [
            ...accum,
            ...curr.user.devices.map((device) => device.pushToken),
          ],
          [] as string[]
        )

        await Push.notify(
          pushTokens.map((pushToken) => ({
            to: pushToken,
            title: `새로운 ${subscriber.name} 공지사항이 올라왔습니다.`,
            body: notices[i],
          }))
        )

        if (!isDev()) {
          this.sendMail(
            `새로운 ${subscriber.name} 공지사항이 올라왔습니다.`,
            subscriber.url,
            subscriber
          )
        }
      }
    } else {
      if (isDev()) {
        console.log(`${subscriber.name}: there is no new notice`)
      }
    }

    this.updateLastNotice(subscriber, notices[0])
    this.writeLastNoticeFile()
  }

  private async visit(
    page: Page,
    subscriber: Subscriber,
    pageNumber?: number
  ): Promise<Set<string>> {
    const pendingXHR = new PendingXHR(page)

    await page.goto(subscriber.url)
    await pendingXHR.waitForAllXhrFinished()
    await page.waitForSelector(subscriber.noticeItemSelector)

    const bodyHtml = await page.$eval('body', (body) => body.innerHTML)

    const body = new JSDOM(bodyHtml).window.document.body

    const notices: Set<string> = new Set()
    const noticeElms = body.querySelectorAll(subscriber.noticeItemSelector)

    for (const noticeElm of Array.from(noticeElms)) {
      const title = subscriber.titleBuilder(noticeElm)
      notices.add(title)
    }

    return notices
  }
}
