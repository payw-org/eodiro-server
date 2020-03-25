import Db, { MysqlInsertOrUpdateResult } from '@/db'
import Auth, { SignUpInfo } from '@/modules/auth'
import EodiroMailer from '@/modules/eodiro-mailer'
import rng from '@/modules/random-name-generator'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'
import { TableNames } from '../table-names'

class User extends Model {
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
  ): Promise<UserType | false>
  static async findWithPortalId(
    portalId: string,
    passwordIncluded = false
  ): Promise<UserType | UserTypePasswordOmitted | false> {
    portalId = portalId.trim()

    if (!portalId.includes('@')) {
      portalId += '@cau.ac.kr'
    }

    const selection: ('*' | keyof UserType)[] = passwordIncluded
      ? ['*']
      : ['id', 'nickname', 'portal_id', 'random_nickname', 'registered_at']
    const query = SqlB<UserType>()
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
      return user as UserType
    } else {
      return user as UserTypePasswordOmitted
    }
  }

  static async findAtId(id: number): Promise<UserTypePasswordOmitted> {
    const query = SqlB<UserType>()
      .select('id', 'nickname', 'portal_id', 'random_nickname', 'registered_at')
      .from('user')
      .where(SqlB().equal('id', undefined))
      .build()

    const [, results] = await Db.query<UserTypePasswordOmitted[]>(query, id)

    const user = results[0]

    return user
  }

  static async findWithAttrFromAll(
    attrName: 'portal_id' | 'nickname',
    value: string
  ): Promise<UserType | false> {
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

  static async findWithToken(token: string): Promise<UserType | false> {
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

    results.forEach((user: UserType) => {
      const query = `
        update user
        set random_nickname = ?
        where id = ${user.id}
      `
      const values = [rng()]
      Db.query(query, values)
    })

    // TODO: send email from the bot
    EodiroMailer.sendMail({
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

export const getUser = createGetModelFunction(
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

export type UserType = {
  id: number
  portal_id: string
  password: string
  nickname: string
  random_nickname: string
  registered_at: string
}

export type UserTypePasswordOmitted = Omit<UserType, 'password'> // @deprecated use `UserTypeSafe` instead
export type UserTypeSafe = Omit<UserType, 'password'>
