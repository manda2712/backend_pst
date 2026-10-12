import express from 'express'
import * as pegawaiService from './pegawai.service.js'
const router = express.Router()
import { uploadFoto } from '../config/upload.js'
import authorizeJWT from '../middleware/authorizeJWT.js'
import adminAuthorizeJWT from '../middleware/adminAuthorizeJWT.js'

router.post(
  '/insert',
  adminAuthorizeJWT,
  uploadFoto.single('foto'),
  async (req, res) => {
    try {
      const pegawai = {
        ...req.body,
        foto: req.file ? req.file.filename : null
      }
      const newPegawai = await pegawaiService.insertPegawai(pegawai)

      res.status(201).json(newPegawai)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
)

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const result = await pegawaiService.loginPegawai(username, password)

    res.status(200).json(result)
  } catch (error) {
    res.status(401).json({
      message: error.message
    })
  }
})

router.get('/', authorizeJWT, async (req, res) => {
  try {
    const pegawai = await pegawaiService.getAllPegawai()
    res.status(200).json(pegawai)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/:id', authorizeJWT, async (req, res) => {
  try {
    const { id } = req.params
    const pegawai = await pegawaiService.getPegawaiById(id)
    res.status(200).json(pegawai)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch(
  '/:id',
  adminAuthorizeJWT,
  uploadFoto.single('foto'),
  async (req, res) => {
    try {
      const { id } = req.params
      const pegawai = {
        ...req.body,
        ...(req.file && { foto: req.file.filename })
      }

      const updatePegawai = await pegawaiService.editDataPegawai(id, pegawai)
      res.status(200).json(updatePegawai)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
)

router.delete('/:id', adminAuthorizeJWT, async (req, res) => {
  try {
    const { id } = req.params
    const result = await pegawaiService.deleteDataPegawai(id)

    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
