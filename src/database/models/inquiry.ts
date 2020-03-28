import Db, { MysqlInsertOrUpdateResult } from '@/db'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'
import { TableNames } from '../table-names'
import { PrimaryAIAttribute } from '../utils/model-attributes'

export interface InquiryNew {
  title: string
  body: string
  email: string
}
export interface AnswerData {
  inquiryId: number
  answer: string
}

export class Inquiry extends Model {
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
      .insert(TableNames.inquiry, {
        email: undefined,
        user_id: undefined,
        title: undefined,
        body: undefined,
        uploaded_at: undefined,
      })
      .build()

    const values = [email, userId, title, body, Time.getCurrTime()]

    const [err, results] = await Db.query<MysqlInsertOrUpdateResult>(
      query,
      values
    )

    if (err) {
      return false
    }

    return (results as Record<string, any>).insertId
  }

  static async getAll(
    amount: number,
    offset: number
  ): Promise<InquiryType[] | false> {
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
    return results as InquiryType[]
  }

  static async getFromUserId(
    userId: number,
    amount: number,
    offset: number
  ): Promise<InquiryType[] | false> {
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

    return results as InquiryType[]
  }
  static isValidAnswer(answer: string): boolean {
    return answer.length > 0
  }
  static async updateInquiry(answerData: AnswerData): Promise<boolean> {
    if (!this.isValidAnswer(answerData.answer)) {
      return false
    }
    const query = `
      update inquiry
      set answer = ?, answered_at = ?
      where id = ?
      `
    const values = [answerData.answer, Time.getCurrTime(), answerData.inquiryId]

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
  ): Promise<InquiryType | false> {
    const query = `
        select * from inquiry
        where id = ?
      `
    const [err, results] = await Db.query(query, inquiryId)
    if (err || !results || results.length != 1) {
      return false
    }
    return results[0] as InquiryType
  }
}

export const inquiry = createGetModelFunction(Inquiry, 'inquiry', {
  id: PrimaryAIAttribute,
  email: {
    type: DataTypes.STRING(320),
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  uploaded_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  answered_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
})

export type InquiryType = {
  id: number
  email: string
  title: string
  body: string
  answer: string
  user_id: number
  uploaded_at: string
  answered_at: string
}
