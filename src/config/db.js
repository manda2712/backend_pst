import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

pool
  .connect()
  .then(client => {
    console.log('Database PostgreSQL berhasil terhubung')
    client.release()
  })
  .catch(error => {
    console.error('Database gagal terhubung:', error.message)
  })
