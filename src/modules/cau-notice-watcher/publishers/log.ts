import { Publisher } from '..'

const url = 'http://log.cau.ac.kr/graduate/notice_list.php'

export const log: Publisher = {
  name: '국제물류학과',
  key: 'log',
  url,
  noticeItemSelector: '.noticeList tbody tr',
  titleBuilder: (noticeElm) =>
    noticeElm.querySelector('.tit')?.textContent?.trim() ?? '',
  urlBuilder: (noticeElm) => url + noticeElm.querySelector('a')?.href ?? '',
}
