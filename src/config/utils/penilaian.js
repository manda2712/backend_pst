function getKategoriKepuasan (nilai) {
  const angka = Number(nilai)

  if (!Number.isFinite(angka) || angka < 0 || angka > 100) {
    throw new Error('Nilai rata-rata harus berada pada rentang 0 sampai 100')
  }

  if (angka <= 25) {
    return 'Sangat Tidak Puas'
  }

  if (angka <= 50) {
    return 'Tidak Puas'
  }

  if (angka <= 75) {
    return 'Puas'
  }

  return 'Sangat Puas'
}

export { getKategoriKepuasan }
