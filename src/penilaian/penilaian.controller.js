import express from 'express'
import * as penilaianService from './penilaian.service.js'
import adminAuthorizeJWT from '../middleware/adminAuthorizeJWT.js'
const router = express.Router()

router.post('/insert', async (req, res) => {
  try {
    const penilaian = req.body

    const newPenilaian = await penilaianService.insertPenilaian(penilaian)
    res.status(201).json(newPenilaian)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const penilaian = await penilaianService.getAllPenilaian()
    res.status(200).json(penilaian)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const penilaian = await penilaianService.getPenilaianId(id)

    res.status(200).json(penilaian)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/:id', adminAuthorizeJWT, async (req, res) => {
  try {
    const { id } = req.params
    const result = await penilaianService.deletePenilaian(id)

    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
