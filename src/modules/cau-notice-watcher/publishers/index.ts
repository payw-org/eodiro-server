import { cau } from './cau'
import { cmc } from './cmc'
import { cse } from './cse'
import { dormitoryBlueMir } from './dormitory-blue-mir'
import { lis } from './lis'
import { log } from './log'
import { planning } from './planning'
import { politics } from './politics'
import { psyche } from './psyche'
import { publicService } from './public-service'
import { sociology } from './sociology'
import { socialwelfare } from './soicalwelfare'

export * from './cau'
export * from './cmc'
export * from './cse'
export * from './dormitory-blue-mir'
export * from './lis'
export * from './log'
export * from './planning'
export * from './politics'
export * from './psyche'
export * from './public-service'
export * from './sociology'
export * from './soicalwelfare'

export const availablePublishers = [
  cau,
  cmc,
  cse,
  dormitoryBlueMir,
  lis,
  log,
  planning,
  politics,
  psyche,
  publicService,
  sociology,
  socialwelfare,
].map((vendor) => ({
  name: vendor.name,
  key: vendor.key,
}))
