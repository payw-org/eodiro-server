import Db from '@/db'
import { SignUpInfo } from '@/modules/auth'
import Auth from '@/modules/auth'
import Time from '@/modules/time'

export interface UserModel {
  id: number
  portal_id: string
  registered_at: string
  nickname: string
  random_nickname: string
}

export default class User {
  static async findWithPortalIdAndPw(
    portalId: string,
    password: string
  ): Promise<UserModel | false> {
    const query = `
      select *
      from user
      where portal_id = ? and password = ?
    `
    const encryptedPassword = Auth.encryptPw(password)
    const [err, results] = await Db.query(query, [portalId, encryptedPassword])

    if (err) {
      console.error(err.message)
      return false
    }

    if (results.length === 0) {
      return undefined
    }

    return results[0]
  }

  static async findAtId(id: number): Promise<UserModel | false> {
    const query = `
      select *
      from user
      where id = ?
    `
    const [err, results] = await Db.query(query, id)

    if (err) {
      console.error(err.message)
      return false
    }

    if (results.length === 0) {
      return undefined
    }

    return results[0]
  }

  static async findWithAttrFromAll(
    attrName: 'portal_id' | 'nickname',
    value: string
  ): Promise<UserModel | false> {
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
      console.log(err)
      return undefined
    }

    if (results.length === 0) {
      return undefined
    }

    return results[0]
  }

  static async findWithToken(token: string): Promise<UserModel | false> {
    const query = `
      select *
      from pending_user
      where token = ?
    `
    const [err, results] = await Db.query(query, token)

    if (err) {
      console.error(err.message)
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
   * @returns Returns generated token
   */
  static async addPendingUser(info: SignUpInfo): Promise<string | false> {
    const query = `
      insert into pending_user
      (portal_id, password, registered_at, nickname, random_nickname, token)
      values (?, ?, ?, ?, "random nickname", ?)
    `
    const encryptedPassword = Auth.encryptPw(info.password)
    const pendingToken = Auth.generatePendingToken()
    const values = [
      info.portalId,
      encryptedPassword,
      Time.getCurrTime(),
      info.nickname,
      pendingToken
    ]
    const [err] = await Db.query(query, values)

    if (err) {
      console.error(err.message)
      return false
    }

    return pendingToken
  }

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
      console.error(err.message)
      return false
    }

    return true
  }
}
