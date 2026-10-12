import authorizeJWT from './authorizeJWT.js'

function adminAuthorizeJWT (req, res, next) {
  authorizeJWT(req, res, error => {
    if (error) {
      return next(error)
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Akses hanya untuk admin'
      })
    }

    next()
  })
}

export default adminAuthorizeJWT
