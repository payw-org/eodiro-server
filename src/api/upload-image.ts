import { httpStatus } from '@/constant/http-status'
import { env } from '@/env'
import axios from 'axios'
import express from 'express'
import FormData from 'form-data'
import multer from 'multer'

const router = express.Router()
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
}).array('file')

router.post('/upload-image', async (req, res) => {
  upload(req, res, async () => {
    const files = Array.from(req.files as Express.Multer.File[])
    const file = files[0]
    const formData = new FormData()
    formData.append('image', file)

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
  })
})

export default router
