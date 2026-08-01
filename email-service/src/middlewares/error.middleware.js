const errorHandler = (err, req, res, next) => {
  console.error('❌ [Email Microservice Error]:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Email Service Internal Error'
  });
};

module.exports = { errorHandler };
