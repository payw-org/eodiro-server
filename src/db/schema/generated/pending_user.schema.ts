/**
 * Copyright 2020 jhaemin
 *
 * Refresh DB
 *
 * This file is automatically generated
 * by the script "refresh-db".
 * Do not modify this file manually.
 * If there comes a situation where this file
 * should move to other place,
 * please update the source "src/dev/refresh-db.js".
 */

export interface PendingUser {
  id: number
  portal_id: string
  password: string
  registered_at: string
  nickname: string
  random_nickname: string
  token: string
}

export const pendingUserFields = [
  'id',
  'portal_id',
  'password',
  'registered_at',
  'nickname',
  'random_nickname',
  'token',
]
