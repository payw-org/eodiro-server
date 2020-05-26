import { Subscriber } from '..'

export const cse: Subscriber = {
  name: '소프트웨어학부',
  key: 'cse',
  url: 'https://cse.cau.ac.kr/sub05/sub0501.php',
  noticeItemSelector: '.table-basic tbody tr',
  titleBuilder: (noticeElm) =>
    noticeElm.querySelector('a').textContent.trim().replace(/NEW$/, '').trim(),
}
