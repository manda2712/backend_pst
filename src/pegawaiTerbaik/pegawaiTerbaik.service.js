import * as pegawaiTerbaikRepository from './pegawaiTerbaik.repository.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

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
  // Ambil data pegawai terbaik dari service yang sudah ada
  const data = await getPegawaiTerbaik(triwulan, tahun)

  // Baca template PDF
  const templatePath = path.join(__dirname, 'templates', 'contoh_serti.pdf')

  const templateBytes = await fs.readFile(templatePath)
  const pdfDoc = await PDFDocument.load(templateBytes)

  const halaman = pdfDoc.getPages()[0]
  const { width, height } = halaman.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Nama pegawai
  const nama = data.pegawai.nama
  const ukuranNama = nama.length > 30 ? 22 : 30
  const lebarNama = fontBold.widthOfTextAtSize(nama, ukuranNama)

  halaman.drawText(nama, {
    x: (width - lebarNama) / 2,
    y: height * 0.48,
    size: ukuranNama,
    font: fontBold,
    color: rgb(0.12, 0.12, 0.12)
  })

  // Keterangan penghargaan
  const keterangan = `Sebagai Pegawai Terbaik ${triwulan} Tahun ${tahun}`

  const ukuranKeterangan = 16
  const lebarKeterangan = font.widthOfTextAtSize(keterangan, ukuranKeterangan)

  halaman.drawText(keterangan, {
    x: (width - lebarKeterangan) / 2,
    y: height * 0.35,
    size: ukuranKeterangan,
    font,
    color: rgb(0.12, 0.12, 0.12)
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
