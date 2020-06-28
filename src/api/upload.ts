import { EodiroQueryType, eodiroQuery } from '@/database/eodiro-query'
import {
  getPublicUserContentPath,
  getStoragePath,
} from '@/cdn/get-storage-path'

import { FileType } from '@/database/models/file'
import SqlB from '@/modules/sqlb'
import { TableNames } from '@/database/table-names'
import { availableMimeTypes } from '@/config/available-mime-types'
import dayjs from 'dayjs'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
}).array('file')

router.post('/upload', async (req, res) => {
  upload(req, res, async () => {
    const storagePath = getStoragePath()

    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath)
    }

    const files = Array.from(req.files as Express.Multer.File[])
    const result = [] as {
      index: number
      err: string
      path: string
      fileId: number
    }[]

    const today = dayjs()
    const todayDate = dayjs().toDate()
    const dateDirectory = getPublicUserContentPath({ date: todayDate })

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const originalName = file.originalname
      const uuid = uuidv4()
      const mimeType = file.mimetype
      const buffer = file.buffer

      let isMimeTypeavailable = false
      let errored = false
      let errMsg = null
      let insertId: number = null

      for (let i = 0; i < availableMimeTypes.length; i += 1) {
        const availableMime = availableMimeTypes[i]
        if (mimeType.startsWith(availableMime)) {
          isMimeTypeavailable = true
          break
        }
      }

      if (!isMimeTypeavailable) {
        res.status(200).json({
          err: 'Unsupported MIME Type',
        })
        errored = true
        errMsg = 'Unsupported MIME Type'
      } else if (file.size > 1024 * 1024 * 3) {
        errored = true
        errMsg = 'File Too Large'
      } else {
        // Create a uuid directory
        fs.mkdirSync(`${dateDirectory}/${uuid}`)

        // Save file
        fs.writeFileSync(`${dateDirectory}/${uuid}/${originalName}`, buffer)

        // Record to DB
        const insertResult = await eodiroQuery(
          SqlB<FileType>().insert(TableNames.file, {
            uuid,
            file_name: originalName,
            mime: mimeType,
            uploaded_at: today.format('YYYY-MM-DD HH:mm:ss'),
          }),
          EodiroQueryType.INSERT
        )
        insertId = insertResult.insertId
      }

      result.push({
        index: i,
        path: !errored
          ? `${getPublicUserContentPath({
              date: todayDate,
              forClient: true,
            })}/${uuid}/${encodeURIComponent(originalName)}`
          : null,
        fileId: errored ? null : insertId,
        err: errored ? errMsg : null,
      })
    }

    res.status(200).json({
      result,
    })
  })
})

export default router
