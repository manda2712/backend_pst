import express from 'express'
const router = express.Router()
import * as pegawaiTerbaikService from './pegawaiTerbaik.service.js'

router.get('/', async (req, res) => {
  try {
    const { triwulan, tahun } = req.query

    if (!triwulan || !tahun) {
      return res.status(400).json({ message: 'Triwulan dan Tahun Wajib Diisi' })
    }
    const pegawaiTerbaik = await pegawaiTerbaikService.getPegawaiTerbaik(
      triwulan,
      tahun
    )
    res.status(200).json(pegawaiTerbaik)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/sertifikat', async (req, res) => {
  try {
    const { triwulan, tahun } = req.query

    if (!triwulan || !tahun) {
      return res.status(400).json({ message: 'Triwulan dan Tahun Wajib Diisi' })
    }
    const tahunAngka = Number(tahun)
    if (
      !Number.isInteger(tahunAngka) ||
      tahunAngka < 2000 ||
      tahunAngka > 9999
    ) {
      return res.status(400).json({ message: 'Tahun Tidak Valid' })
    }

    const sertifikat =
      await pegawaiTerbaikService.generateSertifikatPegawaiTerbaik(
        triwulan,
        tahunAngka
      )
    const namaFileTriwulan = triwulan.replace(/\s+/g, '-')
    const namaFile = `contoh_serti-${namaFileTriwulan}-${tahunAngka}.pdf`

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${namaFile}"`)

    res.status(200).send(Buffer.from(sertifikat.pdfBytes))
  } catch (error) {
    console.error('Gagal membuat sertifikat:', error)

    if (
      error.message ===
      'Data Penilaian Pegawai Pada Periode Tersebut Tidak Ditemukan'
    ) {
      return res.status(404).json({ message: error.message })
    }

    res.status(500).json({
      message: 'Gagal membuat sertifikat Pegawai Terbaik'
    })
  }
})

export default router
