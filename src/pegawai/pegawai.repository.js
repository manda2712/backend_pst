import { pool } from '../config/db.js'
import { handleError } from '../config/utils/errorHandler.js'

async function createPegawai (pegawai) {
  try {
    const { nama, username, nik, jabatan, satuan_kerja, password, role, foto } =
      pegawai
    const newPegawai = await pool.query(
      `INSERT INTO pegawai (nama, username, nik, jabatan, satuan_kerja, password, role, foto) VALUES  ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING * `,
      [nama, username, nik, jabatan, satuan_kerja, password, role, foto]
    )
    return newPegawai.rows[0]
  } catch (error) {
    handleError(error)
  }
}

async function getPegawaiByUsername (username) {
  try {
    const login = await pool.query(
      `SELECT * FROM pegawai WHERE username = $1 `,
      [username]
    )

    return login.rows[0]
  } catch (error) {
    handleError(error)
  }
}

async function getAllPegawai () {
  try {
    const result = await pool.query(`SELECT * FROM pegawai `)
    return result.rows
  } catch (error) {
    handleError(error)
  }
}

async function getPegawaiById (id) {
  try {
    const result = await pool.query(`SELECT * FROM pegawai WHERE id = $1`, [id])
    return result.rows[0]
  } catch (error) {
    handleError(error)
  }
}

async function editPegawai (id, pegawai) {
  try {
    const { nama, username, nik, jabatan, satuan_kerja, password, role, foto } =
      pegawai

    const dataPegawai = await pool.query(
      `UPDATE pegawai SET
         nama = COALESCE($1, nama),
         username = COALESCE($2, username),
         nik = COALESCE($3, nik),
         jabatan = COALESCE($4, jabatan),
         satuan_kerja = COALESCE($5, satuan_kerja),
         password = COALESCE($6, password),
         role = COALESCE($7, role),
          foto = COALESCE($8, foto)
       WHERE id = $9
       RETURNING *`,
      [nama, username, nik, jabatan, satuan_kerja, password, role, foto, id]
    )
    return dataPegawai.rows[0]
  } catch (error) {
    handleError(error)
  }
}

async function deletePegawai (id) {
  try {
    const { rowCount } = await pool.query(`DELETE FROM pegawai WHERE id = $1`, [
      id
    ])
    return rowCount
  } catch (error) {
    handleError(error)
  }
}

export {
  createPegawai,
  getPegawaiByUsername,
  getAllPegawai,
  getPegawaiById,
  editPegawai,
  deletePegawai
}
