import { Publisher } from '..'
import { php1 } from '../publisher-builder'

export const publicService: Publisher = php1({
  name: '공공인재학부',
  key: 'public-service',
  url: 'http://public.cau.ac.kr/04_pov/pov_01a.php',
})
