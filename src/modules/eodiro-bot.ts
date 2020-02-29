// const conn = require('@/modules/db-connector').getConnection()
// const dayjs = require('dayjs')

import dayjs from 'dayjs'
import { CronJob } from 'cron'
import Db from '@/db'
import { UserModel } from '@/db/user'
import User from '@/db/user'
import fs from 'fs'
import Config from '@@/config'
import SqlB from './sqlb'
import getSemester from './get-semester'
import { CTTS } from '@payw/cau-timetable-scraper'
import timetableSeeder from '@/db/seeders/timetable-seeder'
import { CCMS, Restaurant } from '@payw/cau-cafeteria-menus-scraper'
import { CafeteriaMenu } from '@/db/models'
import converCampusName from './convert-campus-name'

export default class EodiroBot {
  isRunning = false

  run(): void {
    if (this.isRunning) {
      return
    } else {
      this.isRunning = true
    }

    this.clearPendingUsers()
    this.updateRandomNickname()
    this.scrapeLectures()
    this.scrapeCafeteriaMenus()
    // this.garbageCollectFiles()
  }

  /**
   * It checks the table 'pending_user' every 30 minutes
   * and eliminates rows which are expired
   */
  private clearPendingUsers(): void {
    const patrolTime = 1000 * 60 * 30
    setInterval(async () => {
      const query = `
        select *
        from pending_user
      `
      const [err, results] = await Db.query(query)

      if (err) {
        console.error(err.message)
        return
      }

      if (!results) {
        return
      }

      ;(results as Array<UserModel>).forEach(async (row) => {
        const registeredAt = dayjs(row.registered_at)
        const now = dayjs()
        const timeDiffMs = now.diff(registeredAt)
        const timeDiffMin = timeDiffMs / 1000 / 60

        // If over 30 minutes after sending a verfication email
        // remove from the pending_user table
        if (timeDiffMin > 30) {
          const sql = `
            delete from pending_user
            where id = ?
          `
          const values = [row.id]
          await Db.query(sql, values)
        }
      })
    }, patrolTime)
  }

  private updateRandomNickname(): void {
    const cronTime = '0 0 * * *'
    const timeZone = 'Asia/Seoul'
    new CronJob(cronTime, User.updateRandomNickname, null, true, timeZone)
  }

  private scrapeLectures(): void {
    const now = dayjs()
    const year = now.year()
    const semester = getSemester()

    const cronTime = '0 2 * * *'
    const timeZone = 'Asia/Seoul'
    new CronJob(
      cronTime,
      async () => {
        const lectures = await CTTS(
          {
            id: Config.CAU_ID,
            pw: Config.CAU_PW,
          },
          {
            year,
            semester,
          }
        )
        timetableSeeder(lectures)
      },
      null,
      true,
      timeZone
    )
  }

  private scrapeCafeteriaMenus(): void {
    new CronJob(
      '0 3 * * *',
      async () => {
        const menus = await CCMS({
          id: Config.CAU_ID,
          pw: Config.CAU_PW,
          days: 5,
        })
        const dbCafeteriaMenus: CafeteriaMenu[] = []
        const daysList: string[] = []
        menus.days.forEach((day) => {
          daysList.push(day.date)
          const dayProcessFunction = (restaurant: Restaurant): void => {
            restaurant.meals.forEach((meal) => {
              dbCafeteriaMenus.push({
                campus: converCampusName(menus.campus),
                served_at: day.date,
                cafeteria_name: restaurant.name,
                title: meal.title,
                time: meal.time,
                price: meal.price,
                menus: JSON.stringify(meal.menus),
              })
            })
          }

          day.breakfast.forEach(dayProcessFunction)
          day.lunch.forEach(dayProcessFunction)
          day.supper.forEach(dayProcessFunction)
        })

        const [err1] = await Db.query(
          SqlB()
            .delete()
            .from('cafeteria_menu')
            .where(
              daysList
                .map((day) => {
                  return `served_at = '${day}'`
                })
                .join(' OR ')
            )
            .build()
        )

        if (err1) {
          return
        }

        await Db.query(
          SqlB()
            .insertBulk('cafeteria_menu', dbCafeteriaMenus)
            .build()
        )
      },
      null,
      true,
      Config.TIME_ZONE
    )
  }

  private garbageCollectFiles(): void {
    const storagePath =
      process.env.NODE_ENV === 'development'
        ? Config.STORAGE_PATH_DEV
        : Config.STORAGE_PATH
    fs.readdir(storagePath, (err, files) => {
      if (err) {
        console.error(err)
        return
      }

      const sqlb = SqlB()

      files.forEach((file) => {
        const fileName = file.split('.')[0]
        const query = sqlb
          .select()
          .from('file')
          .where(`file_name = '${fileName}'`)
          .build()

        Db.query(query).then(([err, results]) => {
          if (results.length === 0) {
            console.log('file not exist')
            fs.unlink(`${storagePath}/${file}`, (err) => {
              if (err) {
                throw err
              }
            })
          }
        })
      })
    })
  }
}
