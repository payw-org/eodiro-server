import { getStoragePath } from '@/cdn/get-storage-path'
import { availableMimeTypes } from '@/config/available-mime-types'
import { eodiroQuery, EodiroQueryType } from '@/database/eodiro-query'
import { FileType } from '@/database/models/file'
import { TableNames } from '@/database/table-names'
import SqlB from '@/modules/sqlb'
import dayjs from 'dayjs'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const upload = multer().array('file')
const publicContentUrl = 'public-user-content'

router.post('/upload', async (req, res) => {
  // TODO: check referer
  // allow only the request from https://eodiro.com in production mode
  // also verify access token

  upload(req, res, async (err) => {
    const storagePath = getStoragePath()

    const files = Array.from(req.files as Express.Multer.File[])
    const result = [] as {
      index: number
      err: string
      path: string
      fileId: number
    }[]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const originalName = file.originalname
      const uuid = uuidv4()
      // TODO: validate mimetype also on the server side
      const mimeType = file.mimetype
      const buffer = file.buffer

      let available = false
      let errored = false
      let errMsg = ''
      let dateDirectory = ''
      let insertId: number

      for (let i = 0; i < availableMimeTypes.length; i += 1) {
        const availableMime = availableMimeTypes[i]
        if (mimeType.startsWith(availableMime)) {
          available = true
          break
        }
      }

      if (!available) {
        res.status(200).json({
          err: 'Unsupported MIME Type',
        })
        result
        return
        errored = true
        errMsg = 'Unsupported MIME Type'
      } else if (file.size > 1024 * 1024 * 3) {
        errored = true
        errMsg = 'File Too Large'
      } else {
        // Check directory existence
        if (!fs.existsSync(`${storagePath}/${publicContentUrl}`)) {
          fs.mkdirSync(`${storagePath}/${publicContentUrl}`)
        }

        const today = dayjs()
        dateDirectory = today.format('YYYYMMDD')

        if (
          !fs.existsSync(`${storagePath}/${publicContentUrl}/${dateDirectory}`)
        ) {
          fs.mkdirSync(`${storagePath}/${publicContentUrl}/${dateDirectory}`)
        }

        // Create a uuid directory
        try {
          fs.mkdirSync(
            `${storagePath}/${publicContentUrl}/${dateDirectory}/${uuid}`
          )
        } catch (error) {
          res.sendStatus(500)
          return
        }

        // Save file
        try {
          fs.writeFileSync(
            `${storagePath}/${publicContentUrl}/${dateDirectory}/${uuid}/${originalName}`,
            buffer
          )
        } catch (error) {
          console.log(error)
          res.sendStatus(500)
          return
        }

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
        path: `/${publicContentUrl}/${dateDirectory}/${uuid}/${encodeURIComponent(
          originalName
        )}`,
        fileId: insertId,
        err: errored ? errMsg : null,
      })
    }

    res.status(200).json({
      result,
    })
  })
})

export default router
