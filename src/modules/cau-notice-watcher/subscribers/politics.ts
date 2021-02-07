import { Subscriber } from '..'
import { php1 } from '../subscriberBuilder'

export const politics: Subscriber = php1({
  name: '정치국제학과',
  key: 'politics',
  url: 'http://politics.cau.ac.kr/07_comm/comm_08a.php',
})
