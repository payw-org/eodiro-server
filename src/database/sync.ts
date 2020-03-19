import { admin } from './models/admin'
import { board } from './models/board'
import { cafeteriaMenu } from './models/cafeteria_menu'
import { changePassword } from './models/change_password'
import { comment } from './models/comment'
import { coverageMajor } from './models/coverage_major'
import { coverageMajorLecture } from './models/coverage_major_lecture'
import { inquiry } from './models/inquiry'
import { lecture } from './models/lecture'
import { pendingUser } from './models/pending_user'
import { period } from './models/period'
import { post } from './models/post'
import { refreshToken } from './models/refresh_token'
import { user } from './models/user'

const alter = {
  alter: true,
}

export async function sync(): Promise<void> {
  await (await user()).sync(alter)
  await (await admin()).sync(alter)
  await (await pendingUser()).sync(alter)
  await (await refreshToken()).sync(alter)
  await (await changePassword()).sync(alter)
  await (await board()).sync(alter)
  await (await post()).sync(alter)
  await (await comment()).sync(alter)
  await (await cafeteriaMenu()).sync(alter)
  await (await coverageMajor()).sync(alter)
  await (await lecture()).sync(alter)
  await (await period()).sync(alter)
  await (await coverageMajorLecture()).sync(alter)
  await (await inquiry()).sync(alter)
}

sync()
