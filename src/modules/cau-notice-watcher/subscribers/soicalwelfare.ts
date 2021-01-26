import { Subscriber } from '..'
import { php1 } from '../subscriberBuilder'

export const socialwelfare: Subscriber = php1({
  name: '사회복지학부',
  key: 'socialwelfare',
  url: 'http://socialwelfare.cau.ac.kr/06_comm/comm_01a.php'
});
