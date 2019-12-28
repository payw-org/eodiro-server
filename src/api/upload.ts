import express from 'express'
import multer from 'multer'
import Config from '@@/config'
import uuidv4 from 'uuid/v4'
import mime from 'mime'
import fs from 'fs'

const router = express.Router()
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5
  }
}).single('file')

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err)

      res.json({
        err: 'fileTooLarge'
      })

      return
    }

    const storagePath =
      process.env.NODE_ENV === 'development'
        ? Config.STORAGE_PATH_DEV
        : Config.STORAGE_PATH

    const file = req.file
    const fileName = uuidv4()
    const fileExtension = mime.getExtension(file.mimetype)
    const buffer = file.buffer

    fs.writeFileSync(`${storagePath}/${fileName}.${fileExtension}`, buffer)
  })
})

export default router
