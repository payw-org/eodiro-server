import { Publisher } from '..'
import { php1 } from '../publisher-builder'

export const cmc: Publisher = php1({
  name: '미디어커뮤니케이션학부',
  key: 'cmc',
  url: 'http://cmc.cau.ac.kr/05_notice/notice_01a.php',
})
