const handleErrors = (error, req, res, next) => {
  console.error(error);

  const message = {
    status: 'error',
    error: error.msg,
    path: error.path
  }

  res.status(400).json(message)
}

module.exports = handleErrors