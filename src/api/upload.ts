import Config from '@/config'
import SqlB from '@/modules/sqlb'
import express from 'express'
import fs from 'fs'
import mime from 'mime'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const upload = multer().array('file')
const sqlb = SqlB()

router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    const storagePath =
      process.env.NODE_ENV === 'development'
        ? Config.STORAGE_PATH_DEV
        : Config.STORAGE_PATH

    const files = Array.from(req.files as Express.Multer.File[])
    const uuids = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const originalName = file.originalname
      const uuid = uuidv4()
      const mimeType = file.mimetype
      const fileExtension = mime.getExtension(mimeType)
      const buffer = file.buffer

      if (file.size > 1024 * 1024 * 5) {
        res.status(200).json({
          err: 'File Too Large',
        })
        return
      }

      try {
        fs.mkdirSync(`${storagePath}/${uuid}`)
      } catch (error) {
        res.sendStatus(500)
        return
      }

      try {
        fs.writeFileSync(`${storagePath}/${uuid}/${originalName}`, buffer)
      } catch (error) {
        res.sendStatus(500)
        return
      }

      uuids.push(uuid)
    }

    res.status(200).json({
      uuids,
    })
  })
})

export default router
