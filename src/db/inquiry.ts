import Db, { MysqlInsertOrUpdateResult } from '@/db'
import { InquiryModel } from '@/db/models'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'

export interface InquiryNew {
  title: string
  body: string
  email: string
}
export interface AnswerData {
  inquiryId: number
  answer: string
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

  static async getAll(
    amount: number,
    offset: number
  ): Promise<InquiryModel[] | false> {
    const query = `
        select * from inquiry
        order by id DESC
        limit ${amount}
        offset ${offset}
      `
    const [err, results] = await Db.query(query)

    if (err) {
      return false
    }

    if (results.length === 0) {
      return undefined
    }
    return results as InquiryModel[]
  }

  static async getFromUserId(
    userId: number,
    amount: number,
    offset: number
  ): Promise<InquiryModel[] | false> {
    const query = `
        select * from inquiry
        where user_id = ${userId}
        order by id DESC
        limit ${amount}
        offset ${offset}
      `
    const [err, results] = await Db.query(query)

    if (err) {
      return false
    }

    if (results.length === 0) {
      return undefined
    }
    return results as InquiryModel[]
  }

  static async update(answerData: AnswerData): Promise<boolean> {
    const query = `
      update inquiry
      set answer = ?
      where id = ?
      `
    const values = [answerData.answer, answerData.inquiryId]

    const [err, results] = await Db.query<MysqlInsertOrUpdateResult>(
      query,
      values
    )
    if (err || results.affectedRows != 1) {
      return false
    }
    return true
  }

  static async getFromInquiryId(
    inquiryId: number
  ): Promise<InquiryModel | false> {
    const query = `
        select * from inquiry
        where id = ?
      `
    const [err, results] = await Db.query(query, inquiryId)
    if (err || !results || results.length != 1) {
      return false
    }
    return results[0] as InquiryModel
  }
}
