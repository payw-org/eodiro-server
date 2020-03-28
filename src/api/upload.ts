import { getStoragePath } from '@/cdn/get-storage-path'
import { availableMimeTypes } from '@/config/available-mime-types'
import { FileType } from '@/database/models/file'
import { query, QueryTypes } from '@/database/query'
import { TableNames } from '@/database/table-names'
import SqlB from '@/modules/sqlb'
import express from 'express'
import fs from 'fs'
import mime from 'mime'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const upload = multer().array('file')
const publicContentUrl = 'public-user-content'

router.post('/upload', async (req, res) => {
  // TODO: check referer
  // allow only the request from https://eodiro.com in production mode
  upload(req, res, async (err) => {
    const storagePath = getStoragePath()

    const files = Array.from(req.files as Express.Multer.File[])
    const result = [] as {
      index: number
      path: string
      fileId: number
    }[]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const originalName = file.originalname
      const uuid = uuidv4()
      // TODO: validate mimetype also on the server side
      const mimeType = file.mimetype
      const fileExtension = mime.getExtension(mimeType)
      const buffer = file.buffer

      let available = false

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
        return
      }

      if (file.size > 1024 * 1024 * 4) {
        res.status(200).json({
          err: 'File Too Large',
        })
        return
      }

      // Check directory existence
      if (!fs.existsSync(`${storagePath}/${publicContentUrl}`)) {
        fs.mkdirSync(`${storagePath}/${publicContentUrl}`)
      }

      // Create a uuid directory
      try {
        fs.mkdirSync(`${storagePath}/${publicContentUrl}/${uuid}`)
      } catch (error) {
        res.sendStatus(500)
        return
      }

      // Save file
      try {
        fs.writeFileSync(
          `${storagePath}/${publicContentUrl}/${uuid}/${originalName}`,
          buffer
        )
      } catch (error) {
        console.log(error)
        res.sendStatus(500)
        return
      }

      // Record to DB
      const [insertId] = await query(
        SqlB<FileType>().insert(TableNames.file, {
          uuid,
          file_name: originalName,
          mime: mimeType,
        }),
        {
          type: QueryTypes.INSERT,
        }
      )

      if (files.length === 1) {
        res.status(200).json({
          path: `/${publicContentUrl}/${uuid}/${encodeURIComponent(
            originalName
          )}`,
          fileId: insertId,
        })
        return
      } else {
        result.push({
          index: i,
          path: `/${publicContentUrl}/${uuid}/${encodeURIComponent(
            originalName
          )}`,
          fileId: insertId,
        })
      }
    }

    res.status(200).json({
      result,
    })
  })
})

export default router
