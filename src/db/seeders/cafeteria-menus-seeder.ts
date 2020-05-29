import { CCMS } from '@payw/cau-cafeteria-menus-scraper'
import { CafeteriaMenuType } from '@/database/models/cafeteria_menu'
import Config from '@/config'
import Db from '@/db'
import EodiroMailer from '@/modules/eodiro-mailer'
import SqlB from '@/modules/sqlb'
import { TableNames } from '@/database/table-names'
import convertCampusName from '@/modules/convert-campus-name'

const CafeteriaMenusSeeder = (): void => {
  return
}

/**
 * Seed 5 days of cafeteria menus starting from today
 */
CafeteriaMenusSeeder.seed = async (): Promise<void> => {
  try {
    console.log(`🌱 Seeding cafeteria menus...`)

    const menus = await CCMS({
      id: Config.CAU_ID,
      pw: Config.CAU_PW,
      days: 5,
    })

    const dbCafeteriaMenus: CafeteriaMenuType[] = []
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

    const query = SqlB()
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
    const [err] = await Db.query(query)

    if (err) {
      console.log(`🌱 Seeding failed`)
      EodiroMailer.sendMail({
        subject: 'Failed to seed cafeteria menus',
        to: 'contact@payw.org',
        html: `
query: ${query}
err: ${err.message}
`,
      })
      return
    }

    const [err2] = await Db.query(
      SqlB().bulkInsert(TableNames.cafeteria_menu, dbCafeteriaMenus).build()
    )

    if (err2) {
      console.log(`🌱 Seeding failed`)
      return
    }

    console.log(`🌱 Successfully seeded 5 days of cafeteria menus`)

    // Send an email after complete
    // await EodiroMailer.sendMail({
    //   subject: '[eodiro Bot] Scraped cafeteria menus',
    //   to: 'io@jhaemin.com',
    //   html: JSON.stringify(dbCafeteriaMenus),
    // })
  } catch (error) {
    // Send an email when failed
    await EodiroMailer.sendMail({
      subject: '[eodiro Bot] Failed to scrape cafeteria menus',
      to: 'io@jhaemin.com',
    })
  }
}

export default CafeteriaMenusSeeder
