import Browser from 'zombie'
import EodiroMailer from '../eodiro-mailer'
import { JSDOM as JsDom } from 'jsdom'
import Push from '../push'
import appRoot from 'app-root-path'
import config from '@/config'
import fs from 'fs'

export type TitleBuilder = (
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
  name: string
  key: string
  link: string
  noticeItemSelector: string
  titleBuilder: TitleBuilder
}

export type LastNotice = Record<string, string>

const lastNoticeFilePath = appRoot.resolve('/.eodiro/last_notice.json')

export class CauNoticeWatcher {
  private feedOptions: FeedOptions
  private subscribers: Subscriber[] = []
  private shouldStop = false
  private browser: any
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

  private loadLastNoticeFile() {
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

  private getLastNotice(subscriber: Subscriber) {
    return this.lastNotice[subscriber.key]
  }

  private updateLastNotice(subscriber: Subscriber, title: string) {
    this.lastNotice[subscriber.key] = title
  }

  public subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber)
  }

  public async run(): Promise<void> {
    if (this.shouldStop) {
      return
    }

    for (const subscriber of this.subscribers) {
      await this.processSubscriber(subscriber)
    }
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

  private async processSubscriber(subscriber: Subscriber) {
    // Create a browser instance before processing
    this.browser = new Browser()

    const notices = Array.from(await this.visit(1, subscriber))

    if (notices.length === 0) {
      return
    }

    const lastNoticeIndex = notices.indexOf(this.getLastNotice(subscriber))

    if (lastNoticeIndex !== -1) {
      for (let i = lastNoticeIndex - 1; i >= 0; i--) {
        await Push.notify({
          to: config.TEST_EXPO_PUSH_TOKEN,
          title: `새로운 ${subscriber.name} 공지사항이 올라왔습니다.`,
          body: notices[i],
        })
      }
    }

    this.updateLastNotice(subscriber, notices[0])
    this.writeLastNoticeFile()

    // Destroy and clean the browser instance after processed
    this.browser.destroy()
    this.browser = null
  }

  private async visit(
    page: number,
    subscriber: Subscriber
  ): Promise<Set<string>> {
    return new Promise((resolve) => {
      const notices: Set<string> = new Set()

      this.browser.visit(subscriber.link, null, () => {
        const body = new JsDom(this.browser.html(subscriber.noticeItemSelector))
          .window.document.body
        const noticeElms = body.querySelectorAll(subscriber.noticeItemSelector)

        for (const noticeElm of Array.from(noticeElms)) {
          const title = subscriber.titleBuilder(noticeElm) || ''

          notices.add(title)
        }

        resolve(notices)
      })
    })
  }

  public stop(): void {
    this.shouldStop = true
  }
}
