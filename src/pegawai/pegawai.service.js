import * as pegawaiRepository from './pegawai.repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

async function insertPegawai (pegawai) {
  const { nama, username, nik, jabatan, satuan_kerja, password, role } = pegawai
  if (
    !nama ||
    !username ||
    !nik ||
    !jabatan ||
    !satuan_kerja ||
    !password ||
    !role
  ) {
    throw new Error('Semua data pegawai wajib diisi')
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newPegawai = await pegawaiRepository.createPegawai({
    nama,
    username,
    nik,
    jabatan,
    satuan_kerja,
    password: hashedPassword,
    role
  })
  return newPegawai
}

async function loginPegawai (username, password) {
  const pegawai = await pegawaiRepository.getPegawaiByUsername(username)

  if (!pegawai) {
    throw new Error('Usernaem atau Password Kamu Salah')
  }
  const passwordValid = await bcrypt.compare(password, pegawai.password)

  if (!passwordValid) {
    throw new Error('Username atau Password Kamu Salah')
  }

  const token = jwt.sign(
    {
      id: pegawai.id,
      username: pegawai.username,
      role: pegawai.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  return {
    message: 'Kamu Berhasil Login!',
    token
  }
}

async function getAllPegawai () {
  const pegawai = await pegawaiRepository.getAllPegawai()
  return pegawai
}

async function getPegawaiById (id) {
  const pegawai = await pegawaiRepository.getPegawaiById(id)
  if (!pegawai) {
    throw new Error('Data Pegawai Tidak Ada')
  }
  return pegawai
}

async function editDataPegawai (id, pegawai) {
  const existingPegawai = await pegawaiRepository.getPegawaiById(id)

  if (!existingPegawai) {
    throw new Error('Data Pegawai Tidak Ditemukan')
  }

  const updateDataPegawai = await pegawaiRepository.editPegawai(id, pegawai)
  return updateDataPegawai
}

async function deleteDataPegawai (id) {
  const pegawai = await pegawaiRepository.getPegawaiById(id)

  if (!pegawai) {
    throw new Error('Data Pegawai Tidak Ditemukan')
  }

  await pegawaiRepository.deletePegawai(id)

  return {
    message: 'Data Pegawai Telah Berhasil Dihapus'
  }
}

export {
  insertPegawai,
  loginPegawai,
  getAllPegawai,
  getPegawaiById,
  editDataPegawai,
  deleteDataPegawai
}
