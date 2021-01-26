import { Subscriber } from '..'

export const psyche: Subscriber = {
  name: '심리학과',
  key: 'psyche',
  url: 'http://psyche.cau.ac.kr/notice/sub01.asp',
  noticeItemSelector: '#sub_content_01 table tr td.bottom[align="left"]:not(.bgcolor1)',
  titleBuilder: (noticeElm) => noticeElm.querySelector('a').textContent.trim(),
  urlBuilder: (noticeElm) => 'http://psyche.cau.ac.kr' + noticeElm.querySelector('a').href, // javascript:view('1151');
}
