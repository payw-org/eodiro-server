import 'module-alias/register'
import { CCMS } from '@payw/cau-cafeteria-menus-scraper'
import Config from '@@/config'

CCMS({
  id: Config.CAU_ID,
  pw: Config.CAU_PW,
  days: 1
}).then((data) => {
  console.log(JSON.stringify(data, null, 2))
})
