// TODO: Rewrite the script with Prisma
// current script won't work due to the different attribute names

import { boot } from '@/boot'
import Config from '@/config'
import Db from '@/db'
import convertCampusName from '@/modules/convert-campus-name'
import EodiroMailer from '@/modules/eodiro-mailer'
import SqlB from '@/modules/sqlb'
import { dbTime } from '@/modules/time'
import { CafeteriaMenu } from '@/prisma/client'
import { CCMS } from '@payw/cau-cafeteria-menus-scraper'
import dayjs from 'dayjs'

const CafeteriaMenusSeeder = (): void => {
  return
}

/**
 * Seed 5 days of cafeteria menus starting from today
 */
CafeteriaMenusSeeder.seed = async (): Promise<void> => {
  const quit = await boot()
  try {
    console.log(`🌱 Seeding cafeteria menus...`)

    const menus = await CCMS({
      id: Config.CAU_ID,
      pw: Config.CAU_PW,
      days: 5,
    })

    const dbCafeteriaMenus: CafeteriaMenu[] = []
    const daysList: string[] = []

    menus.days.forEach((day) => {
      daysList.push(day.date)
      dbCafeteriaMenus.push({
        campus: convertCampusName(menus.campus),
        servedAt: dbTime(dayjs(day.date).toDate()),
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
      SqlB().bulkInsert('cafeteria_menu', dbCafeteriaMenus).build()
    )

    if (err2) {
      console.log(`🌱 Seeding failed`)
      return
    }

    console.log(`🌱 Successfully seeded 5 days of cafeteria menus`)

    // Send an email after complete
    await EodiroMailer.sendMail({
      subject: '[eodiro] Scraped cafeteria menus',
      to: 'contact@payw.org',
      html: JSON.stringify(dbCafeteriaMenus, null, 2),
    })
  } catch (error) {
    // Send an email when failed
    await EodiroMailer.sendMail({
      subject: '[eodiro] Failed to scrape cafeteria menus',
      to: 'contact@payw.org',
    })
  }

  quit()
  process.exit()
}

export default CafeteriaMenusSeeder
