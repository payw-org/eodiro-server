import { Subscriber } from '..'

export const cau: Subscriber = {
  name: 'CAU Notice',
  key: 'cau',
  link: 'https://cse.cau.ac.kr/sub05/sub0501.php',
  noticeItemSelector: '.table-basic tbody tr',
  titleBuilder: (noticeElm) => {
    // const mark = noticeElm.querySelector('.mark_noti').textContent.trim()
    // const title = noticeElm.querySelector('a').textContent.trim()
    // return `${mark} ${title}`

    return ''
  },
}
