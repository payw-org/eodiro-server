import { Campus } from '@/types'

export default function converCampusName(campus: string): Campus {
  campus = campus.toLowerCase()
  return campus === 'seoul' ? '서울' : campus === 'anseong' ? '안성' : '서울'
}
