function handleError (error) {
  if (error instanceof Error) {
    console.error('error:', error.message)
    throw error
  }

  console.error('error:', error)
  throw new Error(String(error))
}

export { handleError }
