import EodiroMailer from '../eodiro-mailer'
import FeedSub from 'feedsub'

export const cauNoticeRssFeed = () => {
  const reader = new FeedSub(
    'https://www.cau.ac.kr/cms/FR_PRO_CON/BoardRss.do',
    {
      interval: 10,
    }
  )

  reader.on('item', (item) => {
    EodiroMailer.sendMail({
      to: 'io@jhaemin.com',
      subject: 'CAU Notice',
      html: JSON.stringify(item, null, 2),
    })
  })

  reader.start(true)
}
