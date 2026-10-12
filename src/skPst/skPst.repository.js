import { pool } from '../config/db.js'

async function getSKByPeriode (tahun, triwulan) {
  const result = await pool.query(
    `SELECT id,
        tahun,
        triwulan,
        nomor_surat,
        tanggal_penetapan,
        created_at
        FROM sk_pst WHERE tahun = $1
       AND triwulan = $2`,
    [tahun, triwulan]
  )
  return result.rows[0] ?? null
}

async function createSK (tahun, triwulan, nomorSurat) {
  const result = await pool.query(
    `INSERT INTO sk_pst (
        tahun,
        triwulan,
        nomor_surat,
        tanggal_penetapan
     )
     VALUES ($1, $2, $3, CURRENT_DATE)
     RETURNING
        id,
        tahun,
        triwulan,
        nomor_surat,
        tanggal_penetapan,
        created_at`,
    [tahun, triwulan, nomorSurat]
  )

  return result.rows[0]
}

async function getNomorSuratTerakhir (tahun) {
  const result = await pool.query(
    `SELECT COALESCE(MAX(nomorSurat), 0) AS nomor_terakhir
     FROM sk_pst
     WHERE tahun = $1`,
    [tahun]
  )

  return Number(result.rows[0].nomor_terakhir)
}

export { getSKByPeriode, createSK, getNomorSuratTerakhir }
