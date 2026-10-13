// import express from 'express'
// import * as skPstService from './skPst.Service.js'
// import authorizeJWT from '../middleware/authorizeJWT.js'

// const router = express.Router()
// router.get('/', authorizeJWT, async (req, res) => {
//   try {
//     const { triwulan, tahun } = req.query

//     if (!triwulan || !tahun) {
//       return res.status(400).json({
//         message: 'Triwulan dan Tahun Wajib Diisi'
//       })
//     }
//     const triwulanAngka = Number(String(triwulan).replace(/\D/g, ''))
//     const tahunAngka = Number(tahun)

//     if (
//       !Number.isInteger(triwulanAngka) ||
//       triwulanAngka < 1 ||
//       triwulanAngka > 4
//     ) {
//       return res.status(400).json({
//         message: 'Triwulan Tidak Valid'
//       })
//     }

//     if (
//       !Number.isInteger(tahunAngka) ||
//       tahunAngka < 2000 ||
//       tahunAngka > 9999
//     ) {
//       return res.status(400).json({
//         message: 'Tahun Tidak Valid'
//       })
//     }

//     const dataSK = await skPstService.getSKPegawaiTerbaik(
//       triwulanAngka,
//       tahunAngka
//     )

//     return res.status(200).json({
//       message: 'Data SK Pegawai Terbaik Berhasil Diambil',
//       data: dataSK
//     })
//   } catch (error) {
//     console.error('Gagal mengambil data SK:', error)

//     if (
//       error.message.includes(
//         'Data Penilaian Pegawai Pada Periode Tersebut Tidak Ditemukan'
//       )
//     ) {
//       return res.status(404).json({
//         message: error.message
//       })
//     }

//     return res.status(500).json({
//       message: 'Gagal mengambil data SK Pegawai Terbaik'
//     })
//   }
// })

// router.get('/pdf', authorizeJWT, async (req, res) => {
//   try {
//     const { triwulan, tahun } = req.query

//     if (!triwulan || !tahun) {
//       return res.status(400).json({
//         message: 'Triwulan dan Tahun Wajib Diisi'
//       })
//     }

//     const triwulanAngka = Number(String(triwulan).replace(/\D/g, ''))
//     const tahunAngka = Number(tahun)

//     if (
//       !Number.isInteger(triwulanAngka) ||
//       triwulanAngka < 1 ||
//       triwulanAngka > 4
//     ) {
//       return res.status(400).json({
//         message: 'Triwulan Tidak Valid'
//       })
//     }

//     if (
//       !Number.isInteger(tahunAngka) ||
//       tahunAngka < 2000 ||
//       tahunAngka > 9999
//     ) {
//       return res.status(400).json({
//         message: 'Tahun Tidak Valid'
//       })
//     }

//     const hasil = await skPstService.generateSKPegawaiTerbaik(
//       triwulanAngka,
//       tahunAngka
//     )

//     res.setHeader('Content-Type', 'application/pdf')
//     res.setHeader(
//       'Content-Disposition',
//       `attachment; filename="${hasil.namaFile}"`
//     )

//     return res.status(200).send(hasil.pdfBuffer)
//   } catch (error) {
//     console.error('Gagal generate PDF SK:', error)

//     return res.status(500).json({
//       message: 'Gagal membuat PDF SK Pegawai Terbaik'
//     })
//   }
// })

// export default router

import express from 'express'
import * as skPstService from './skPst.Service.js'
import authorizeJWT from '../middleware/authorizeJWT.js'

const router = express.Router()

// Mengubah format triwulan menjadi angka
function parseTriwulan (triwulan) {
  const nilai = String(triwulan).trim().toUpperCase()

  const mapping = {
    1: 1,
    'TW 1': 1,
    'TW I': 1,
    I: 1,

    2: 2,
    'TW 2': 2,
    'TW II': 2,
    II: 2,

    3: 3,
    'TW 3': 3,
    'TW III': 3,
    III: 3,

    4: 4,
    'TW 4': 4,
    'TW IV': 4,
    IV: 4
  }

  return mapping[nilai] ?? NaN
}

// Validasi parameter request
function validasiQuery (req, res) {
  const { triwulan, tahun } = req.query

  if (!triwulan || !tahun) {
    res.status(400).json({
      message: 'Triwulan dan Tahun Wajib Diisi'
    })
    return null
  }

  const triwulanAngka = parseTriwulan(triwulan)
  const tahunAngka = Number(tahun)

  if (
    !Number.isInteger(triwulanAngka) ||
    triwulanAngka < 1 ||
    triwulanAngka > 4
  ) {
    res.status(400).json({
      message: 'Triwulan Tidak Valid'
    })
    return null
  }

  if (!Number.isInteger(tahunAngka) || tahunAngka < 2000 || tahunAngka > 9999) {
    res.status(400).json({
      message: 'Tahun Tidak Valid'
    })
    return null
  }

  return { triwulanAngka, tahunAngka }
}

// GET data SK pegawai terbaik
router.get('/', authorizeJWT, async (req, res) => {
  try {
    const parameter = validasiQuery(req, res)

    if (!parameter) return

    const { triwulanAngka, tahunAngka } = parameter

    const dataSK = await skPstService.getSKPegawaiTerbaik(
      triwulanAngka,
      tahunAngka
    )

    return res.status(200).json({
      message: 'Data SK Pegawai Terbaik Berhasil Diambil',
      data: dataSK
    })
  } catch (error) {
    console.error('Gagal mengambil data SK:', error)

    if (
      error.message.includes(
        'Data Penilaian Pegawai Pada Periode Tersebut Tidak Ditemukan'
      )
    ) {
      return res.status(404).json({
        message: error.message
      })
    }

    return res.status(500).json({
      message: 'Gagal mengambil data SK Pegawai Terbaik'
    })
  }
})

// GET PDF SK pegawai terbaik
router.get('/pdf', authorizeJWT, async (req, res) => {
  try {
    const parameter = validasiQuery(req, res)

    if (!parameter) return

    const { triwulanAngka, tahunAngka } = parameter

    const hasil = await skPstService.generateSKPegawaiTerbaik(
      triwulanAngka,
      tahunAngka
    )

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${hasil.namaFile}"`
    )

    return res.status(200).send(hasil.docxBuffer)
  } catch (error) {
    console.error('Gagal generate DOCX SK:', error)

    if (
      error.message.includes(
        'Data Penilaian Pegawai Pada Periode Tersebut Tidak Ditemukan'
      )
    ) {
      return res.status(404).json({
        message: error.message
      })
    }

    return res.status(500).json({
      message: 'Gagal membuat DOCX SK Pegawai Terbaik'
    })
  }
})

export default router
