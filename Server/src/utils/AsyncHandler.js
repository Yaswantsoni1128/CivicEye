const AsyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (error) {
    console.error('AsyncHandler Error:', error)
    res.status(error.code).json({
      success: false,
      message: error.message,
    })
    next(error)
  }
}

export { AsyncHandler }
