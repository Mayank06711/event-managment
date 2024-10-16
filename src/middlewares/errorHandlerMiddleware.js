const errorMiddleware = async (err, req, res, next) => {
  err.message ||= "Internal Server Error, please try again later";
  const statusCode = err.statusCode || 500;

  console.error(`Error: ${err}`); // apierror
  res.status(statusCode).json({
    sucess: false,
    message: process.env.NODE_ENV.trim() === "DEVELOPMENT" ? err: err.message 
  });
};

export default errorMiddleware
