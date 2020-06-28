// TODO: garbage collect files which are not connected to tips

import { EodiroQueryType, eodiroQuery } from '@/database/eodiro-query'

import { FileType } from '@/database/models/file'
import { PostFileType } from '@/database/models/post_file'
import SqlB from '@/modules/sqlb'
import { TableNames } from '@/database/table-names'
import _ from 'lodash'
import { boot } from '@/boot'
import dayjs from 'dayjs'
import fs from 'fs'
import { getStoragePath } from '@/cdn/get-storage-path'
import glob from 'glob'
import path from 'path'
import util from 'util'

const globSync = util.promisify(glob)

export const run = async (): Promise<void> => {
  const quit = await boot({ db: true })

  const squarePublicPath = getStoragePath() + '/public-user-content'

  const fileDirs = await globSync(squarePublicPath + '/*/*')

  const dbFiles = await eodiroQuery<FileType>(
    SqlB().select().from(TableNames.file).order('uuid')
  )

  const fileDirsWithUploadDate = fileDirs.map((fileDir) => {
    const fileUuid = path.basename(fileDir)

    return {
      fileDir: fileDir,
      uuid: fileUuid,
      uploadedAt: dayjs(_.find(dbFiles, { uuid: fileUuid })?.uploaded_at),
    }
  })

  const selectPostFile = await eodiroQuery<PostFileType & FileType>(
    SqlB()
      .select()
      .from()
      .join(TableNames.post_file, TableNames.file)
      .on('post_file.file_id = file.id')
      .order('uuid')
  )
  const postFileUuids = selectPostFile.map((result) => result.uuid)

  // Delete the files which are not connected to any posts
  // and are aged over three hours
  const now = dayjs()
  const lostRefs = fileDirsWithUploadDate.filter(
    (fileWithDate) =>
      !postFileUuids.includes(fileWithDate.uuid) &&
      now.diff(fileWithDate.uploadedAt, 'hour') > 3
  )

  for (const ref of lostRefs) {
    // Delete from DB
    await eodiroQuery(
      SqlB().delete().from(TableNames.file).where().equal('uuid', ref.uuid),
      EodiroQueryType.DELETE
    )
    // Delete from file system
    fs.rmdirSync(ref.fileDir, { recursive: true })
  }

  quit()
}

run()
