import { Subscriber } from '..'
import { php1 } from '../subscriberBuilder'

export const sociology: Subscriber = php1({
  name: '사회학과',
  key: 'sociology',
  url: 'http://sociology.cau.ac.kr/05_college/college_01a.php'
});
