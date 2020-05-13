import { Subscriber } from '..'

export const cau: Subscriber = {
  name: 'CAU Notice',
  key: 'cau',
  link: 'https://www.cau.ac.kr/cms/FR_CON/index.do?MENU_ID=100#page1',
  noticeItemSelector: '.typeNoti',
  titleBuilder: (noticeElm) => {
    const mark = noticeElm.querySelector('.mark_noti').textContent.trim()
    const title = noticeElm.querySelector('a').textContent.trim()

    return `${mark} ${title}`
  },
}
