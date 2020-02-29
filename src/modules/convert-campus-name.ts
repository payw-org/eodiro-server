import { Campus } from '@/types'

export default function convertCampusName(campus: string): Campus {
  campus = campus.toLowerCase()
  return campus === 'seoul' ? '서울' : campus === 'anseong' ? '안성' : '서울'
}
