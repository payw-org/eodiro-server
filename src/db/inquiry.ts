import Db from '@/db'
import { InquiryModel } from '@/db/models'
import Time from '@/modules/time'
import User from '@/db/user'
import SqlB from '@/modules/sqlb'

export interface InquiryNew {
  title: string
  body: string
  email: string | null
}

export default class Inquiry {
  static isValidTitle(title: string): boolean {
    return title.length > 0
  }

  static isValidBody(body: string): boolean {
    return body.length > 0
  }

  static isValidEmail(email: string): boolean {
    const emailRegExp = new RegExp(
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    )
    const results = emailRegExp.exec(email)
    return results && results.length > 0
  }

  static async upload(
    userId: number | null,
    inquiryData: InquiryNew
  ): Promise<false | number> {
    const title = inquiryData.title.trim()
    const body = inquiryData.body.trim()
    const email = inquiryData.email.trim()
    if (
      !this.isValidTitle(title) ||
      !this.isValidBody(body) ||
      !this.isValidEmail(email)
    ) {
      console.log('trim')
      return false
    }
    const query = SqlB()
      .insert('inquiry', {
        email: undefined,
        user_id: undefined,
        title: undefined,
        body: undefined,
        uploaded_at: undefined,
      })
      .build()

    const values = [email, userId, title, body, Time.getCurrTime()]

    const [err, results] = await Db.query(query, values)

    if (err) {
      return false
    }

    return (results as Record<string, any>).insertId
  }
}
