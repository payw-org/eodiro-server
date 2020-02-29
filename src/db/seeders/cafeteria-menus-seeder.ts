import { CCMS } from '@payw/cau-cafeteria-menus-scraper'
import Config from '@@/config'
import { CafeteriaMenuModel } from '@/db/models'
import convertCampusName from '@/modules/convert-campus-name'
import Db from '@/db'
import SqlB from '@/modules/sqlb'

const CafeteriaMenusSeeder = (): void => {
  return
}

/**
 * Seed 5 days of cafeteria menus starting from today
 */
CafeteriaMenusSeeder.seed = async (): Promise<void> => {
  console.log(`🌱 Seeding cafeteria menus...`)

  const menus = await CCMS({
    id: Config.CAU_ID,
    pw: Config.CAU_PW,
    days: 5,
  })
  const dbCafeteriaMenus: CafeteriaMenuModel[] = []
  const daysList: string[] = []

  menus.days.forEach((day) => {
    daysList.push(day.date)
    dbCafeteriaMenus.push({
      campus: convertCampusName(menus.campus),
      served_at: day.date,
      data: JSON.stringify({
        breakfast: day.breakfast,
        lunch: day.lunch,
        supper: day.supper,
      }),
    })
  })

  const [err] = await Db.query(
    SqlB()
      .delete()
      .from('cafeteria_menu')
      .where(
        daysList
          .map((day) => {
            return `campus = '${convertCampusName(
              menus.campus
            )}' AND served_at = '${day}'`
          })
          .join(' OR ')
      )
      .build()
  )

  if (err) {
    console.log(`🌱 Seeding failed`)
    return
  }

  const [err2] = await Db.query(
    SqlB()
      .insertBulk('cafeteria_menu', dbCafeteriaMenus)
      .build()
  )

  if (err2) {
    console.log(`🌱 Seeding failed`)
    return
  }

  console.log(`🌱 Successfully seeded 5 days of cafeteria menus`)
}

export default CafeteriaMenusSeeder
