import * as pegawaiTerbaikRepository from './pegawaiTerbaik.repository.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

async function getPegawaiTerbaik (triwulan, tahun) {
  const ranking = await pegawaiTerbaikRepository.getRankPegawai(triwulan, tahun)

  if (ranking.length === 0) {
    throw new Error(
      'Data Penilaian Pegawai Pada Periode Tersebut Tidak Ditemukan'
    )
  }

  const pegawaiTerbaik = ranking[0]
  const penilaian = await pegawaiTerbaikRepository.getPenilaianPegawaiTerbaik(
    pegawaiTerbaik.id_pegawai,
    triwulan,
    tahun
  )
  return {
    triwulan,
    tahun: Number(tahun),
    pegawai: {
      id: pegawaiTerbaik.id_pegawai,
      nama: pegawaiTerbaik.nama_pegawai,
      nik: pegawaiTerbaik.nik,
      jabatan: pegawaiTerbaik.jabatan,
      satuan_kerja: pegawaiTerbaik.satuan_kerja
    },
    rata_rata_nilai: Number(Number(pegawaiTerbaik.rata_rata_nilai).toFixed(2)),
    penilaian
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
async function generateSertifikatPegawaiTerbaik (triwulan, tahun) {
  const data = await getPegawaiTerbaik(triwulan, tahun)

  // Baca template PDF
  const templatePath = path.join(
    __dirname,
    'templates',
    'Sertifikat_pegawai_terbaik.pdf'
  )

  const templateBytes = await fs.readFile(templatePath)
  const pdfDoc = await PDFDocument.load(templateBytes)
  pdfDoc.registerFontkit(fontkit)

  const fontBytes = await fs.readFile(
    path.join(__dirname, 'fonts', 'GreatVibes-Regular.ttf')
  )

  const fontNama = await pdfDoc.embedFont(fontBytes)

  const halaman = pdfDoc.getPages()[0]
  const { width, height } = halaman.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const tanggalSekarang = new Date()

  const namaBulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]

  const tanggalPenerbitan =
    `${tanggalSekarang.getDate()} ` +
    `${namaBulan[tanggalSekarang.getMonth()]} ` +
    `${tanggalSekarang.getFullYear()}`

  const teksTanggal = `Palu, ${tanggalPenerbitan}`
  const ukuranTanggal = 13

  const lebarTanggal = fontBold.widthOfTextAtSize(teksTanggal, ukuranTanggal)

  halaman.drawText(teksTanggal, {
    x: width - lebarTanggal - 208,
    y: height * 0.48 - 120,
    size: ukuranTanggal,
    font: fontBold,
    color: rgb(0.05, 0.15, 0.35)
  })

  // Nama pegawai
  const nama = data.pegawai.nama
  const ukuranNama = nama.length > 30 ? 32 : 50

  const lebarNama = fontNama.widthOfTextAtSize(nama, ukuranNama)

  halaman.drawText(nama, {
    x: (width - lebarNama) / 2,
    y: height * 0.48 + 40,
    size: ukuranNama,
    font: fontNama,
    color: rgb(0.05, 0.15, 0.35)
  })

  // Keterangan penghargaan
  const barisKeterangan = [
    'Atas pelayanan yang sigap,',
    'cepat dan ramah serta menerapkan budaya anti korupsi',
    'dalam memberikan pelayanan kepada konsumen data',
    'di Badan Pusat Statistik Kota Palu',
    `${triwulan} Tahun ${tahun}`
  ]

  const ukuranKeterangan = 16
  const jarakBaris = 19

  // Naikkan blok keterangan agar tidak menutupi tanda tangan
  const posisiAwalY = height * 0.48

  barisKeterangan.forEach((baris, index) => {
    const lebarBaris = font.widthOfTextAtSize(baris, ukuranKeterangan)

    halaman.drawText(baris, {
      x: (width - lebarBaris) / 2,
      y: posisiAwalY - index * jarakBaris,
      size: ukuranKeterangan,
      font,
      color: rgb(0.05, 0.15, 0.35)
    })
  })

  // Simpan hasil PDF di memori
  const pdfBytes = await pdfDoc.save()

  return {
    pdfBytes,
    namaPegawai: data.pegawai.nama,
    triwulan,
    tahun
  }
}
export { getPegawaiTerbaik, generateSertifikatPegawaiTerbaik }
