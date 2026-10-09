function handleError (error) {
  if (error instanceof Error) {
    console.error('error;', error.message)
    throw error.message
  } else {
    console.error('error:', error)
    throw error
  }
}

export { handleError }
