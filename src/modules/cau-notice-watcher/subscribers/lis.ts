import { Subscriber } from '..'
import { php1 } from '../subscriberBuilder'

export const lis: Subscriber = php1({
  name: '문헌정보학과',
  key: 'lis',
  url: 'http://lis.cau.ac.kr/02_notice/notice_01a.php',
})
