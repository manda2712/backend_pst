import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'

const uploadDir = path.resolve('uploads/pegawai')

fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const namaFile = `pegawai-${Date.now()}${ext}`

    cb(null, namaFile)
  }
})

function fileFilter (req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Foto harus berformat JPG, PNG, atau WEBP'))
  }

  cb(null, true)
}

const uploadFoto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
})

export { uploadFoto }
