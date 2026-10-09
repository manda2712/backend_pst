import { pool } from '../config/db.js'
import { handleError } from '../config/utils/errorHandler.js'

async function getRankPegawai (triwulan, tahun) {
  try {
    const result = await pool.query(
      `SELECT
        p.id_pegawai,
        pg.nama AS nama_pegawai,
        pg.nik,
        pg.jabatan,
        pg.satuan_kerja,
        AVG(p.jumlah_nilai) AS rata_rata_nilai
      FROM penilaian_pegawai p
      JOIN pegawai pg
        ON p.id_pegawai = pg.id
      WHERE p.triwulan = $1
        AND p.tahun = $2
      GROUP BY
        p.id_pegawai,
        pg.nama,
        pg.nik,
        pg.jabatan,
        pg.satuan_kerja
      ORDER BY rata_rata_nilai DESC`,
      [triwulan, tahun]
    )
    return result.rows
  } catch (error) {
    handleError(error)
  }
}
async function getPenilaianPegawaiTerbaik (id_pegawai, triwulan, tahun) {
  try {
    const result = await pool.query(
      `
      SELECT
        p.id,
        p.id_pegawai,
        pg.nama AS nama_pegawai,
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
        p.tahun
      FROM penilaian_pegawai p
      JOIN pegawai pg
        ON p.id_pegawai = pg.id
      WHERE p.id_pegawai = $1
        AND p.triwulan = $2
        AND p.tahun = $3
      ORDER BY p.tanggal ASC
      `,
      [id_pegawai, triwulan, tahun]
    )

    return result.rows
  } catch (error) {
    handleError(error)
  }
}

export { getRankPegawai, getPenilaianPegawaiTerbaik }
