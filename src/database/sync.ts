import { Database } from './index'
import { admin } from './models/admin'
import { cafeteriaMenu } from './models/cafeteria_menu'
import { changePassword } from './models/change_password'
import { comment } from './models/comment'
import { coverageMajor } from './models/coverage_major'
import { coverageMajorLecture } from './models/coverage_major_lecture'
import { getBoard } from './models/board'
import { getDevice } from './models/device'
import { getFile } from './models/file'
import { getPostFile } from './models/post_file'
import { getUser } from './models/user'
import { initPost } from './models/post'
import { initPostLike } from './models/post_like'
import { inquiry } from './models/inquiry'
import { lecture } from './models/lecture'
import { pendingUser } from './models/pending_user'
import { period } from './models/period'
import { refreshToken } from './models/refresh_token'

const alter = {
  alter: true,
}

async function sync(): Promise<void> {
  await Database.initSequelize(true)

  await (await getFile()).sync(alter)
  await (await getUser()).sync(alter)
  await (await admin()).sync(alter)
  await (await pendingUser()).sync(alter)
  await (await refreshToken()).sync(alter)
  await (await changePassword()).sync(alter)
  await (await getBoard()).sync(alter)
  await (await initPost()).sync(alter)
  await (await getPostFile()).sync(alter)
  await (await initPostLike()).sync(alter)
  await (await comment()).sync(alter)
  await (await cafeteriaMenu()).sync(alter)
  await (await coverageMajor()).sync(alter)
  await (await lecture()).sync(alter)
  await (await period()).sync(alter)
  await (await coverageMajorLecture()).sync(alter)
  await (await inquiry()).sync(alter)
  await (await getDevice()).sync(alter)

  await (await Database.getSequelize()).close()
}

sync()
