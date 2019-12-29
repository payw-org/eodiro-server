import express from 'express'
import multer from 'multer'
import Config from '@@/config'
import uuidv4 from 'uuid/v4'
import mime from 'mime'
import fs from 'fs'
import SqlB from '@/modules/sqlb'
import Db from '@/db'

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
          err: 'fileTooLarge'
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
      uuids
    })
  })
})

export default router
