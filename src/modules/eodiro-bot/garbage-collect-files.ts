import { getStoragePath } from '@/cdn/get-storage-path'
import { eodiroQuery, EodiroQueryType } from '@/database/eodiro-query'
import { FileType } from '@/database/models/file'
import { PostFileType } from '@/database/models/post_file'
import { TableNames } from '@/database/table-names'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import util from 'util'
import SqlB from '../sqlb'

const globSync = util.promisify(glob)

export const garbageCollectFiles = async () => {
  const squarePublicPath = getStoragePath() + '/public-user-content'

  const fileDirs = await globSync(squarePublicPath + '/*/*')
  const fsUuids = fileDirs.map((filePath) => path.basename(filePath))

  const selectDbFile = await eodiroQuery<FileType>(
    SqlB().select().from(TableNames.file).order('uuid')
  )
  const dbFileUuids = selectDbFile.map((file) => file.uuid)

  const selectPostFile = await eodiroQuery<PostFileType & FileType>(
    SqlB()
      .select()
      .from()
      .join(TableNames.post_file, TableNames.file)
      .on('post_file.file_id = file.id')
      .order('uuid')
  )
  const postFileUuids = selectPostFile.map((result) => result.uuid)

  const lostRefDirs = fileDirs.filter(
    (filePath) => !postFileUuids.includes(path.basename(filePath))
  )

  for (const dir of lostRefDirs) {
    // Delete from DB
    await eodiroQuery(
      SqlB()
        .delete()
        .from(TableNames.file)
        .where()
        .equal('uuid', path.basename(dir)),
      EodiroQueryType.DELETE
    )
    // Delete from file system
    fs.rmdirSync(dir, { recursive: true })
  }
}
