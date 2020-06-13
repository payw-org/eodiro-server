import Auth, { SignUpInfo } from '@/modules/auth'
import { DataTypes, Model } from 'sequelize'
import Db, { MysqlInsertOrUpdateResult } from '@/db'

import EodiroMailer from '@/modules/eodiro-mailer'
import SqlB from '@/modules/sqlb'
import { TableNames } from '../table-names'
import Time from '@/modules/time'
import { createInitModelFunction } from '../create-init-model'
import rng from '@/modules/random-name-generator'

export type UserAttrs = {
  id: number
  portal_id: string
  password: string
  nickname: string
  random_nickname: string
  registered_at: string
}

export type UserAttrsPasswordOmitted = Omit<UserAttrs, 'password'> // @deprecated use `UserAttrSafe` instead
export type UserAttrsSafe = Omit<UserAttrs, 'password'>

export class User extends Model {
  static tableName = 'user'
  static attrs = {
    id: 'id',
    portal_id: 'portal_id',
    password: 'password',
    nickname: 'nickname',
    random_nickname: 'random_nickname',
    registered_at: 'registered_at',
  }

  /**
   * Get user information using portal email id.
   *
   * @param portalId With/without email address.
   * @param passwordIncluded If set to true, return password included information.
   * @returns `false`: server error. `undefined`: no user found.
   */
  static async findWithPortalId(
    portalId: string,
    passwordIncluded?: true
  ): Promise<UserAttrs | false>
  static async findWithPortalId(
    portalId: string,
    passwordIncluded = false
  ): Promise<UserAttrs | UserAttrsPasswordOmitted | false> {
    portalId = portalId.trim()

    if (!portalId.includes('@')) {
      portalId += '@cau.ac.kr'
    }

    const selection: ('*' | keyof UserAttrs)[] = passwordIncluded
      ? ['*']
      : ['id', 'nickname', 'portal_id', 'random_nickname', 'registered_at']
    const query = SqlB<UserAttrs>()
      .select(...selection)
      .from(TableNames.user)
      .where()
      .equal('portal_id', portalId)
      .build()

    const [err, results] = await Db.query(query, [portalId])

    if (err) {
      return false
    }

    if (results.length === 0) {
      return undefined
    }

    const user = results[0]

    if (passwordIncluded) {
      return user as UserAttrs
    } else {
      return user as UserAttrsPasswordOmitted
    }
  }

  static async findAtId(id: number): Promise<UserAttrsPasswordOmitted> {
    const query = SqlB<UserAttrs>()
      .select('id', 'nickname', 'portal_id', 'random_nickname', 'registered_at')
      .from('user')
      .where(SqlB().equal('id', undefined))
      .build()

    const [, results] = await Db.query<UserAttrsPasswordOmitted[]>(query, id)

    const user = results[0]

    return user
  }

  static async findWithAttrFromAll(
    attrName: 'portal_id' | 'nickname',
    value: string
  ): Promise<UserAttrs | false> {
    if (attrName !== 'portal_id' && attrName !== 'nickname') {
      return undefined
    }

    const query = `
      select id, portal_id, registered_at, nickname, random_nickname
      from
      (
        select id, portal_id, registered_at, nickname, random_nickname
        from user
        union
        select id, portal_id, registered_at, nickname, random_nickname
        from pending_user
      ) user_union
      where ${attrName} = ?
    `
    const [err, results] = await Db.query(query, value)

    if (err) {
      console.error(err.stack)
      return undefined
    }

    if (results.length === 0) {
      return undefined
    }

    return results[0]
  }

  static async findWithToken(token: string): Promise<UserAttrs | false> {
    const query = `
      select *
      from pending_user
      where token = ?
    `
    const [err, results] = await Db.query(query, token)

    if (err) {
      console.error(err.stack)
      return false
    }

    if (results.length === 0) {
      return undefined
    }

    return results[0]
  }

  /**
   * Add a new user to pending_user table.
   *
   * **_NOTE_**: Pass raw password instead of encrypted one.
   *
   * @returns Returns generated token(verification code)
   */
  static async addPendingUser(info: SignUpInfo): Promise<string | false> {
    const query = `
      insert into pending_user
      (portal_id, password, registered_at, nickname, random_nickname, token)
      values (?, ?, ?, ?, ?, ?)
    `
    const encryptedPassword = await Auth.encryptPw(info.password)
    const pendingToken = Auth.generateToken()
    const values = [
      info.portalId,
      encryptedPassword,
      Time.getCurrTime(),
      info.nickname,
      rng(),
      pendingToken,
    ]
    const [err] = await Db.query(query, values)

    if (err) {
      console.error(err.stack)
      return false
    }

    return pendingToken
  }

  /**
   * Transfer pending user to active user.
   */
  static async transferPendingUser(pendingUserId: number): Promise<boolean> {
    const query = `
      insert into user (portal_id, password, registered_at, nickname, random_nickname)
      select portal_id, password, registered_at, nickname, random_nickname
      from pending_user
      where id = ?;
      delete from pending_user
      where id = ?;
    `
    const [err] = await Db.query(query, [pendingUserId, pendingUserId])

    if (err) {
      console.error(err.stack)
      return false
    }

    return true
  }

  // TODO: update password
  // static async updatePassword(
  //   userId: number,
  //   newPassword: string
  // ): Promise<boolean> {
  //   const query = `
  //     update user
  //     set password = ?
  //     where id = ?
  //   `
  // }

  /**
   * Update all users' random nickname.
   */
  static async updateRandomNickname(): Promise<void> {
    const query = `select * from user`
    const [err, results] = await Db.query(query)

    if (err) {
      console.error(err)
      return
    }

    results.forEach((user: UserAttrs) => {
      const query = `
        update user
        set random_nickname = ?
        where id = ${user.id}
      `
      const values = [rng()]
      Db.query(query, values)
    })

    // TODO: send email from the bot
    await EodiroMailer.sendMail({
      to: 'contact@payw.org',
      subject: 'Updating user random nickname',
    })
  }

  /**
   * Update user password with newer one.
   *
   * @param userId
   * @param newPassword
   * @returns `false`: error. `undefined`: no user.
   */
  static async updatePassword(
    userId: number,
    newPassword: string
  ): Promise<boolean> {
    const query = `
      update user
      set password = ?
      where id = ?
    `

    const encryptedPassword = await Auth.encryptPw(newPassword)
    const values = [encryptedPassword, userId]
    const [err, results] = await Db.query<MysqlInsertOrUpdateResult>(
      query,
      values
    )

    if (err) {
      return false
    }

    if (results.affectedRows === 0) {
      return undefined
    }

    return true
  }
}

export const getUser = createInitModelFunction(
  User,
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    portal_id: {
      type: DataTypes.STRING(320),
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    random_nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    registered_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ['portal_id'],
      },
    ],
  }
)

export const userId = {
  user_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
}
