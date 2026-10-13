// import * as skPstRepository from './skPst.repository.js'
// import * as pegawaiTerbaikService from '../pegawaiTerbaik/pegawaiTerbaik.service.js'
// import fs from 'node:fs/promises'
// import path from 'node:path'
// import { fileURLToPath } from 'node:url'
// import PizZip from 'pizzip'
// import Docxtemplater from 'docxtemplater'
// import libre from 'libreoffice-convert'
// import { promisify } from 'node:util'

// const NOMOR_AWAL_SK = 124
// async function getSKPegawaiTerbaik (triwulan, tahun) {
//   const triwulanAngka = Number(String(triwulan).replace(/\D/g, ''))
//   const tahunAngka = Number(tahun)

//   if (
//     !Number.isInteger(triwulanAngka) ||
//     triwulanAngka < 1 ||
//     triwulanAngka > 4
//   ) {
//     throw new Error('Triwulan harus bernilai 1 sampai 4')
//   }

//   if (!Number.isInteger(tahunAngka) || tahunAngka < 2000 || tahunAngka > 9999) {
//     throw new Error('Tahun tidak valid')
//   }

//   const dataPegawaiTerbaik = await pegawaiTerbaikService.getPegawaiTerbaik(
//     triwulanAngka,
//     tahunAngka
//   )

//   let dataSK = await skPstRepository.getSKByPeriode(tahunAngka, triwulanAngka)

//   if (!dataSK) {
//     const nomorTerakhir = await skPstRepository.getNomorSuratTerakhir(
//       tahunAngka
//     )

//     const nomorSurat = nomorTerakhir === 0 ? NOMOR_AWAL_SK : nomorTerakhir + 1

//     try {
//       dataSK = await skPstRepository.createSK(
//         tahunAngka,
//         triwulanAngka,
//         nomorSurat
//       )
//     } catch (error) {
//       if (error.code === '23505') {
//         dataSK = await skPstRepository.getSKByPeriode(tahunAngka, triwulanAngka)

//         if (!dataSK) throw error
//       } else {
//         throw error
//       }
//     }
//   }

//   return {
//     ...dataSK,
//     pegawai: dataPegawaiTerbaik.pegawai,
//     rata_rata_nilai: dataPegawaiTerbaik.rata_rata_nilai
//   }
// }

// const convertToPdf = promisify(libre.convert)

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// async function generateSKPegawaiTerbaik (triwulan, tahun) {
//   // Ambil data SK dan pegawai terbaik dari service sebelumnya
//   const dataSK = await getSKPegawaiTerbaik(triwulan, tahun)

//   const templatePath = path.join(
//     __dirname,
//     'templates',
//     'Template_SK_PST_Berprestasi.docx'
//   )

//   // Baca template Word
//   const templateBuffer = await fs.readFile(templatePath)

//   // Buka template dengan PizZip dan Docxtemplater
//   const zip = new PizZip(templateBuffer)

//   const doc = new Docxtemplater(zip, {
//     paragraphLoop: true,
//     linebreaks: true
//   })

//   // Format tanggal tanpa menggeser tanggal karena timezone
//   const tanggal = String(dataSK.tanggal_penetapan).slice(0, 10)
//   const [tahunTanggal, bulanTanggal, hariTanggal] = tanggal.split('-')

//   const namaBulan = [
//     'Januari',
//     'Februari',
//     'Maret',
//     'April',
//     'Mei',
//     'Juni',
//     'Juli',
//     'Agustus',
//     'September',
//     'Oktober',
//     'November',
//     'Desember'
//   ]

//   const tanggalPenetapan = `${Number(hariTanggal)} ${
//     namaBulan[Number(bulanTanggal) - 1]
//   } ${tahunTanggal}`

//   const triwulanRomawi = ['', 'I', 'II', 'III', 'IV'][Number(triwulan)]

//   // Isi placeholder sesuai template asli
//   doc.render({
//     nomor_surat: `${dataSK.nomor_surat}/KBPS TAHUN ${dataSK.tahun}`,
//     triwulan_teks: `TRIWULAN ${triwulanRomawi}`,
//     tahun: dataSK.tahun,
//     tanggal_penetapan: tanggalPenetapan,
//     nama: dataSK.pegawai.nama,
//     nip: dataSK.pegawai.nik,
//     jabatan: dataSK.pegawai.jabatan
//   })

//   // Hasilkan DOCX yang sudah terisi
//   const docxBuffer = doc.toBuffer()

//   // Konversi DOCX ke PDF
//   const pdfBuffer = await convertToPdf(docxBuffer, '.pdf', undefined)

//   return {
//     pdfBuffer,
//     namaFile: `SK_PST_Berprestasi_TW${triwulan}_${tahun}.pdf`
//   }
// }

// export { getSKPegawaiTerbaik, generateSKPegawaiTerbaik }

// import * as skPstRepository from './skPst.repository.js'
// import * as pegawaiTerbaikService from '../pegawaiTerbaik/pegawaiTerbaik.service.js'

// import fs from 'node:fs/promises'
// import path from 'node:path'
// import { fileURLToPath } from 'node:url'
// import PizZip from 'pizzip'
// import Docxtemplater from 'docxtemplater'
// import libre from 'libreoffice-convert'
// import { promisify } from 'node:util'

// const NOMOR_AWAL_SK = 124
// const convertToPdf = promisify(libre.convert)

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const NAMA_BULAN = [
//   'Januari',
//   'Februari',
//   'Maret',
//   'April',
//   'Mei',
//   'Juni',
//   'Juli',
//   'Agustus',
//   'September',
//   'Oktober',
//   'November',
//   'Desember'
// ]

// const TRIWULAN_ROMAWI = ['', 'I', 'II', 'III', 'IV']

// // Mengubah input triwulan menjadi angka
// function parseTriwulan (triwulan) {
//   const nilai = String(triwulan).trim().toUpperCase()

//   const mapping = {
//     1: 1,
//     'TW 1': 1,
//     'TW I': 1,
//     I: 1,

//     2: 2,
//     'TW 2': 2,
//     'TW II': 2,
//     II: 2,

//     3: 3,
//     'TW 3': 3,
//     'TW III': 3,
//     III: 3,

//     4: 4,
//     'TW 4': 4,
//     'TW IV': 4,
//     IV: 4
//   }

//   return mapping[nilai] ?? Number(nilai)
// }

// // Validasi periode
// function validasiPeriode (triwulan, tahun) {
//   const triwulanAngka = parseTriwulan(triwulan)
//   const tahunAngka = Number(tahun)

//   if (
//     !Number.isInteger(triwulanAngka) ||
//     triwulanAngka < 1 ||
//     triwulanAngka > 4
//   ) {
//     throw new Error('Triwulan harus bernilai 1 sampai 4')
//   }

//   if (!Number.isInteger(tahunAngka) || tahunAngka < 2000 || tahunAngka > 9999) {
//     throw new Error('Tahun tidak valid')
//   }

//   return { triwulanAngka, tahunAngka }
// }

// // Format tanggal Indonesia
// function formatTanggal (tanggalDatabase) {
//   const tanggal = String(tanggalDatabase).slice(0, 10)
//   const [tahun, bulan, hari] = tanggal.split('-').map(Number)

//   if (!tahun || !bulan || bulan > 12 || !hari || hari > 31) {
//     throw new Error('Tanggal penetapan SK tidak valid')
//   }

//   return `${hari} ${NAMA_BULAN[bulan - 1]} ${tahun}`
// }

// // Mengambil data SK dan pegawai terbaik
// async function getSKPegawaiTerbaik (triwulan, tahun) {
//   const { triwulanAngka, tahunAngka } = validasiPeriode(triwulan, tahun)

//   // Ikuti alur service pegawai terbaik yang sudah ada
//   const dataPegawaiTerbaik = await pegawaiTerbaikService.getPegawaiTerbaik(
//     triwulanAngka,
//     tahunAngka
//   )

//   // Cek SK berdasarkan periode
//   let dataSK = await skPstRepository.getSKByPeriode(tahunAngka, triwulanAngka)

//   // Jika SK belum ada, buat nomor SK baru
//   if (!dataSK) {
//     const nomorTerakhir = await skPstRepository.getNomorSuratTerakhir(
//       tahunAngka
//     )

//     const nomorSurat = nomorTerakhir === 0 ? NOMOR_AWAL_SK : nomorTerakhir + 1

//     try {
//       dataSK = await skPstRepository.createSK(
//         tahunAngka,
//         triwulanAngka,
//         nomorSurat
//       )
//     } catch (error) {
//       // Antisipasi jika SK periode yang sama dibuat bersamaan
//       if (error.code === '23505') {
//         dataSK = await skPstRepository.getSKByPeriode(tahunAngka, triwulanAngka)

//         if (!dataSK) {
//           throw error
//         }
//       } else {
//         throw error
//       }
//     }
//   }

//   return {
//     ...dataSK,
//     pegawai: dataPegawaiTerbaik.pegawai,
//     rata_rata_nilai: dataPegawaiTerbaik.rata_rata_nilai
//   }
// }

// // Generate PDF SK dari template Word
// async function generateSKPegawaiTerbaik (triwulan, tahun) {
//   const { triwulanAngka, tahunAngka } = validasiPeriode(triwulan, tahun)

//   const dataSK = await getSKPegawaiTerbaik(triwulanAngka, tahunAngka)

//   const templatePath = path.join(
//     __dirname,
//     'templates',
//     'Template_SK_PST_Berprestasi.docx'
//   )

//   const templateBuffer = await fs.readFile(templatePath)
//   const zip = new PizZip(templateBuffer)

//   const doc = new Docxtemplater(zip, {
//     paragraphLoop: true,
//     linebreaks: true
//   })

//   const triwulanRomawi = TRIWULAN_ROMAWI[triwulanAngka]
//   const tanggalPenetapan = formatTanggal(dataSK.tanggal_penetapan)

//   doc.render({
//     nomor_surat: `${dataSK.nomor_surat}/KBPS TAHUN ${dataSK.tahun}`,

//     triwulan_teks: `TRIWULAN ${triwulanRomawi}`,
//     tahun: dataSK.tahun,
//     tanggal_penetapan: tanggalPenetapan,

//     nama: dataSK.pegawai.nama,
//     nip: dataSK.pegawai.nik,
//     jabatan: dataSK.pegawai.jabatan
//   })

//   const docxBuffer = doc.toBuffer()

//   const pdfBuffer = await convertToPdf(docxBuffer, '.pdf', undefined)

//   return {
//     pdfBuffer,
//     namaFile: `SK_PST_Berprestasi_TW${triwulanAngka}_${tahunAngka}.pdf`
//   }
// }

// export { getSKPegawaiTerbaik, generateSKPegawaiTerbaik }

import * as skPstRepository from './skPst.repository.js'
import * as pegawaiTerbaikService from '../pegawaiTerbaik/pegawaiTerbaik.service.js'

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

const NOMOR_AWAL_SK = 124

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const NAMA_BULAN = [
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

const TRIWULAN_ROMAWI = ['', 'I', 'II', 'III', 'IV']

// Mengubah input triwulan menjadi angka
function parseTriwulan (triwulan) {
  const nilai = String(triwulan).trim().toUpperCase()

  const mapping = {
    1: 1,
    'TW 1': 1,
    'TW I': 1,
    TW01I: 1,
    'TW 01 I': 1,
    I: 1,

    2: 2,
    'TW 2': 2,
    'TW II': 2,
    TW02I: 2,
    'TW 02 I': 2,
    II: 2,

    3: 3,
    'TW 3': 3,
    'TW III': 3,
    TW03I: 3,
    'TW 03 I': 3,
    III: 3,

    4: 4,
    'TW 4': 4,
    'TW IV': 4,
    TW04I: 4,
    'TW 04 I': 4,
    IV: 4
  }

  return mapping[nilai] ?? Number(nilai)
}

// Mengubah angka menjadi format triwulan sesuai database
function formatTriwulanDatabase (triwulan) {
  const angka = parseTriwulan(triwulan)

  if (!Number.isInteger(angka) || angka < 1 || angka > 4) {
    throw new Error('Triwulan harus bernilai 1 sampai 4')
  }

  return `TW ${TRIWULAN_ROMAWI[angka]}`
}

// Validasi periode
function validasiPeriode (triwulan, tahun) {
  const triwulanAngka = parseTriwulan(triwulan)
  const tahunAngka = Number(tahun)

  if (
    !Number.isInteger(triwulanAngka) ||
    triwulanAngka < 1 ||
    triwulanAngka > 4
  ) {
    throw new Error('Triwulan harus bernilai 1 sampai 4')
  }

  if (!Number.isInteger(tahunAngka) || tahunAngka < 2000 || tahunAngka > 9999) {
    throw new Error('Tahun tidak valid')
  }

  return { triwulanAngka, tahunAngka }
}

// Format tanggal Indonesia

function formatTanggal (tanggalDatabase) {
  if (!tanggalDatabase) {
    throw new Error(`Tanggal penetapan SK kosong: ${tanggalDatabase}`)
  }

  // Jika PostgreSQL mengembalikan Date object,
  // gunakan komponen tanggal UTC.
  let tahun
  let bulan
  let hari

  if (tanggalDatabase instanceof Date) {
    if (Number.isNaN(tanggalDatabase.getTime())) {
      throw new Error('Tanggal penetapan SK bukan tanggal valid')
    }

    tahun = tanggalDatabase.getUTCFullYear()
    bulan = tanggalDatabase.getUTCMonth() + 1
    hari = tanggalDatabase.getUTCDate()
  } else {
    const tanggal = String(tanggalDatabase).slice(0, 10)
    const cocok = tanggal.match(/^(\d{4})-(\d{2})-(\d{2})$/)

    if (!cocok) {
      throw new Error(
        `Format tanggal penetapan SK tidak valid: ${tanggalDatabase}`
      )
    }

    tahun = Number(cocok[1])
    bulan = Number(cocok[2])
    hari = Number(cocok[3])
  }

  const tanggalValid = new Date(Date.UTC(tahun, bulan - 1, hari))

  if (
    bulan < 1 ||
    bulan > 12 ||
    tanggalValid.getUTCFullYear() !== tahun ||
    tanggalValid.getUTCMonth() + 1 !== bulan ||
    tanggalValid.getUTCDate() !== hari
  ) {
    throw new Error(`Tanggal penetapan SK tidak valid: ${tanggalDatabase}`)
  }

  return `${hari} ${NAMA_BULAN[bulan - 1]} ${tahun}`
}

// Mengambil data SK dan pegawai terbaik
async function getSKPegawaiTerbaik (triwulan, tahun) {
  const { triwulanAngka, tahunAngka } = validasiPeriode(triwulan, tahun)

  // Format yang sesuai dengan nilai pada kolom database:
  // TW I, TW II, TW III, TW IV
  const triwulanDatabase = formatTriwulanDatabase(triwulanAngka)

  console.log('Periode SK:', {
    triwulanDatabase,
    tahun: tahunAngka
  })

  // Ambil data pegawai terbaik
  const dataPegawaiTerbaik = await pegawaiTerbaikService.getPegawaiTerbaik(
    triwulanDatabase,
    tahunAngka
  )

  // Cek SK berdasarkan periode
  let dataSK = await skPstRepository.getSKByPeriode(tahunAngka, triwulanAngka)

  // Jika SK belum ada, buat nomor SK baru
  if (!dataSK) {
    const nomorTerakhir = await skPstRepository.getNomorSuratTerakhir(
      tahunAngka
    )

    const nomorSurat = nomorTerakhir === 0 ? NOMOR_AWAL_SK : nomorTerakhir + 1

    try {
      dataSK = await skPstRepository.createSK(
        tahunAngka,
        triwulanAngka,
        nomorSurat
      )
    } catch (error) {
      // Antisipasi jika SK periode yang sama dibuat bersamaan
      if (error.code === '23505') {
        dataSK = await skPstRepository.getSKByPeriode(tahunAngka, triwulanAngka)

        if (!dataSK) {
          throw error
        }
      } else {
        throw error
      }
    }
  }

  return {
    ...dataSK,
    pegawai: dataPegawaiTerbaik.pegawai,
    rata_rata_nilai: dataPegawaiTerbaik.rata_rata_nilai
  }
}

// Generate PDF SK dari template Word
async function generateSKPegawaiTerbaik (triwulan, tahun) {
  const { triwulanAngka, tahunAngka } = validasiPeriode(triwulan, tahun)

  const dataSK = await getSKPegawaiTerbaik(triwulanAngka, tahunAngka)

  const templatePath = path.join(
    __dirname,
    'templates',
    'Template_SK_PST_Berprestasi_Dinamis.docx'
  )

  const templateBuffer = await fs.readFile(templatePath)
  const zip = new PizZip(templateBuffer)

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true
  })

  const triwulanRomawi = TRIWULAN_ROMAWI[triwulanAngka]

  console.log('Data SK dari database:', dataSK)
  console.log('Tanggal penetapan:', dataSK.tanggal_penetapan)

  const tanggalPenetapan = formatTanggal(dataSK.tanggal_penetapan)

  doc.render({
    nomor_surat: `${dataSK.nomor_surat}/KBPS TAHUN ${dataSK.tahun}`,
    triwulan_teks: `TRIWULAN ${triwulanRomawi}`,
    tahun: dataSK.tahun,
    nomor_urut: 1,
    tanggal_penetapan: tanggalPenetapan,
    nama: dataSK.pegawai.nama,
    nip: dataSK.pegawai.nik,
    jabatan: dataSK.pegawai.jabatan
  })

  const docxBuffer = doc.toBuffer()

  return {
    docxBuffer,
    namaFile: `SK_PST_Berprestasi_TW${triwulanAngka}_${tahunAngka}.docx`
  }
}

export { getSKPegawaiTerbaik, generateSKPegawaiTerbaik }
