import * as penilaianRepository from './penilaian.repository.js'
import { getKategoriKepuasan } from '../config/utils/penilaian.js'

async function insertPenilaian (penilaian) {
  const {
    id_pegawai,
    nama,
    tanggal,
    kehadiran,
    kinerja,
    kerja_sama,
    inovatif_kreatif,
    penampilan,
    pelayanan_prima,
    keterangan_pelayanan_prima,
    kritik_saran,
    triwulan,
    tahun
  } = penilaian

  if (
    !id_pegawai ||
    !nama ||
    !tanggal ||
    kehadiran === undefined ||
    kinerja === undefined ||
    kerja_sama === undefined ||
    inovatif_kreatif === undefined ||
    penampilan === undefined ||
    pelayanan_prima === undefined ||
    !triwulan ||
    !tahun
  ) {
    throw new Error('Semua data penilaian wajib diisi')
  }

  const nilaiPelayananPrima = pelayanan_prima ? 0 : 100
  let keteranganPelayananPrima = null

  if (pelayanan_prima) {
    if (!keterangan_pelayanan_prima) {
      throw new Error('Kamu Wajib Mengisi Komplain')
    }

    keteranganPelayananPrima = keterangan_pelayanan_prima
  }

  const jumlahNilai =
    (Number(kehadiran) +
      Number(kinerja) +
      Number(kerja_sama) +
      Number(inovatif_kreatif) +
      Number(penampilan) +
      nilaiPelayananPrima) /
    6

  const newPenilaian = await penilaianRepository.createPenilaian({
    id_pegawai,
    nama,
    tanggal,
    kehadiran,
    kinerja,
    kerja_sama,
    inovatif_kreatif,
    penampilan,
    pelayanan_prima,
    keterangan_pelayanan_prima: keteranganPelayananPrima,
    kritik_saran,
    jumlah_nilai: jumlahNilai,
    triwulan,
    tahun
  })

  return newPenilaian
}

async function getAllPenilaian () {
  const penilaian = await penilaianRepository.getAllPenilaian()

  return penilaian.map(data => ({
    id: data.id,
    id_pegawai: data.id_pegawai,
    jumlah_nilai: data.jumlah_nilai,
    kategori_kepuasan: getKategoriKepuasan(data.jumlah_nilai),

    nama_responden: data.nama_responden,

    pegawai: {
      id: data.pegawai_id,
      nama: data.nama_pegawai,
      nik: data.nik,
      jabatan: data.jabatan,
      satuan_kerja: data.satuan_kerja,
      username: data.username,
      role: data.role
    },

    tanggal: data.tanggal,
    kehadiran: data.kehadiran,
    kinerja: data.kinerja,
    kerja_sama: data.kerja_sama,
    inovatif_kreatif: data.inovatif_kreatif,
    penampilan: data.penampilan,
    pelayanan_prima: data.pelayanan_prima,
    keterangan_pelayanan_prima: data.keterangan_pelayanan_prima,
    kritik_saran: data.kritik_saran,
    jumlah_nilai: data.jumlah_nilai,
    triwulan: data.triwulan,
    tahun: data.tahun,
    created_at: data.created_at
  }))
}

async function getPenilaianId (id) {
  const penilaian = await penilaianRepository.getPenilaianById(id)

  if (!penilaian) {
    throw new Error('Data Penilaian Tidak Ditemukan')
  }

  return {
    id: penilaian.id,
    id_pegawai: penilaian.id_pegawai,
    nama_responden: penilaian.nama_responden,
    jumlah_nilai: penilaian.jumlah_nilai,
    kategori_kepuasan: getKategoriKepuasan(penilaian.jumlah_nilai),

    pegawai: {
      id: penilaian.pegawai_id,
      nama: penilaian.nama_pegawai,
      nik: penilaian.nik,
      jabatan: penilaian.jabatan,
      satuan_kerja: penilaian.satuan_kerja,
      username: penilaian.username,
      role: penilaian.role,
      tanggal: penilaian.tanggal,
      kehadiran: penilaian.kehadiran,
      kinerja: penilaian.kinerja,
      kerja_sama: penilaian.kerja_sama,
      inovatif_kreatif: penilaian.inovatif_kreatif,
      penampilan: penilaian.penampilan,
      pelayanan_prima: penilaian.pelayanan_prima,
      keterangan_pelayanan_prima: penilaian.keterangan_pelayanan_prima,
      kritik_saran: penilaian.kritik_saran,
      jumlah_nilai: penilaian.jumlah_nilai,
      triwulan: penilaian.triwulan,
      tahun: penilaian.tahun,
      created_at: penilaian.created_at
    }
  }
}

async function deletePenilaian (id) {
  const penilaian = await penilaianRepository.getPenilaianById(id)

  if (!penilaian) {
    throw new Error('Data Penilaian Pegawai Tersebut Tidak DItemukan')
  }

  await penilaianRepository.deleteDataPenilaian(id)

  return { message: 'Data Penilaian Berhasil Dihapus' }
}

export { insertPenilaian, getAllPenilaian, getPenilaianId, deletePenilaian }
