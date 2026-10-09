import express from 'express'
import dotenv from 'dotenv'
import './src/config/db.js'
import pegawaiController from './src/pegawai/pegawai.controller.js'
import penilaianController from './src/penilaian/penilaian.controller.js'
import pegawaiTerbaikController from './src/pegawaiTerbaik/pegawaiTerbaik.controller.js'
dotenv.config()

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/api/pegawai', pegawaiController)
app.use('/api/penilaian', penilaianController)
app.use('/api/pegawaiTerbaik', pegawaiTerbaikController)

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
})
