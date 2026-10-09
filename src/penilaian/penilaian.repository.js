import { pool } from '../config/db.js'
import { handleError } from '../config/utils/errorHandler.js'

async function createPenilaian (penilaian) {
  try {
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
      jumlah_nilai,
      triwulan,
      tahun
    } = penilaian

    const result = await pool.query(
      `INSERT INTO penilaian_pegawai (
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
        jumlah_nilai,
        triwulan,
        tahun
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 )
      RETURNING *`,
      [
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
        jumlah_nilai,
        triwulan,
        tahun
      ]
    )

    return result.rows[0]
  } catch (error) {
    handleError(error)
  }
}

async function getAllPenilaian () {
  try {
    const result = await pool.query(`SELECT
        p.id,
        p.id_pegawai,
         pg.nama AS nama_pegawai,
        pg.nik,
        pg.jabatan,
        pg.satuan_kerja,
        pg.username,
        p.nama AS nama_responden,
        p.tanggal,
        p.kehadiran,
        p.kinerja,
        p.kerja_sama,
        p.inovatif_kreatif,
        p.penampilan,
        p.pelayanan_prima,
        p.keterangan_pelayanan_prima,
        p.jumlah_nilai,
        p.triwulan,
        p.tahun,
        p.created_at
      FROM penilaian_pegawai p
      JOIN pegawai pg
        ON p.id_pegawai = pg.id
      ORDER BY p.tahun DESC, p.tanggal DESC`)
    return result.rows
  } catch (error) {
    handleError(error)
  }
}

async function getPenilaianById (id) {
  try {
    const result = await pool.query(
      `SELECT
        p.id,
        p.id_pegawai,
        pg.nama AS nama_pegawai,
        pg.nik,
        pg.jabatan,
        pg.satuan_kerja,
        pg.username,
        p.nama AS nama_responden,
        p.tanggal,
        p.kehadiran,
        p.kinerja,
        p.kerja_sama,
        p.inovatif_kreatif,
        p.penampilan,
        p.pelayanan_prima,
        p.keterangan_pelayanan_prima,
        p.jumlah_nilai,
        p.triwulan,
        p.tahun,
        p.created_at
      FROM penilaian_pegawai p
      JOIN pegawai pg
        ON p.id_pegawai = pg.id
      WHERE p.id = $1`,
      [id]
    )
    return result.rows[0]
  } catch (error) {
    handleError(error)
  }
}

async function deleteDataPenilaian (id) {
  try {
    const { rowCount } = await pool.query(
      `DELET FROM penilaian_pegawai WHERE id = $1`,
      [id]
    )
    return rowCount
  } catch (error) {}
}

export {
  createPenilaian,
  getAllPenilaian,
  getPenilaianById,
  deleteDataPenilaian
}
