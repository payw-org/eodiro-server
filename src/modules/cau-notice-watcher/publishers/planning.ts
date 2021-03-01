import { Publisher } from '..'

export const planning: Publisher = {
  name: '도시계획부동산학과',
  key: 'planning',
  url: 'http://planning.cau.ac.kr/bbs/board.php?tbl=notice',
  noticeItemSelector:
    'table.tbl-list_new tr td.line_bottom[align="left"]:not(.bg_color1)',
  titleBuilder: (noticeElm) =>
    noticeElm.querySelector('a')?.textContent?.trim() ?? '',
  urlBuilder: (noticeElm) =>
    'http://planning.cau.ac.kr' + noticeElm.querySelector('a')?.href ?? '',
}
