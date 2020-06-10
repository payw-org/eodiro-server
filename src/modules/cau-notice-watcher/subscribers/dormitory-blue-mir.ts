import { Subscriber } from '..'

// TODO: urlBuilder

export const dormitoryBlueMir: Subscriber = {
  name: '생활관(블루미르홀)',
  key: 'dormitory-blue-mir',
  url: 'http://dormitory.cau.ac.kr/bbs/bbs_list.php?bbsID=notice',
  noticeItemSelector: '#content table tr[bgcolor="#fffcdb"]',
  titleBuilder: (noticeElm) => noticeElm.querySelector('span').textContent,
}
