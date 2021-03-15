import { httpStatus } from '@/constant/http-status'
import { env } from '@/env'
import axios from 'axios'
import express from 'express'
import FormData from 'form-data'
import fs from 'fs'
import multer from 'multer'

const router = express.Router()
const upload = multer({
  dest: './',
})

router.post('/', upload.single('image'), async (req, res) => {
  console.log(req.file)
  const file = req.file
  const stream = fs.createReadStream(file.path)
  const formData = new FormData()
  formData.append('image', stream)

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.imgur.com/3/upload',
      headers: {
        Authorization: `Client-ID ${env.IMGUR_CLIENT_ID}`,
        ...formData.getHeaders(),
      },
      data: formData,
    })

    res.status(200).json({
      link: response.data.data.link,
    })
  } catch (error) {
    console.error(error.response?.data)
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }

  fs.unlinkSync(file.path)
})

export default router
