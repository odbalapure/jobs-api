const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  // Mongoose sends very generic errors i.e. 500 incase of validation errros
  // There needs to be a proper error message eg: If an email is duplicate
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again...",
  };

  /* NOTE: The customError object does the job of sending error msgs
    So we can comment out this code */
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  /* Send better mongoose validator errors - email or password not entered for registration */
  if (err.name === "ValidationError") {
    /* Eg: err.errors.password.message || err.errors.email.message */
    console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }

  /* Error msg and status code for duplicate fields */
  if (err.code && err.code === 11000) {
    customError.msg = `User with this ${Object.keys(
      err.keyValue
    )} already exists, please enter something else`;
    customError.statusCode = 400;
  }

  /* Check for errors - finding user/job with id that does not exist */
  if (err.name === "CastError") {
    customError.msg = `No item found with ${err.value}`;
    customError.statusCode = 404;
  }
  
  /* 
  NOTE: Sending err.keyValue will be shown as object Object
  Object.keys(err.keyValue) prints "email" as it is the key
  This will tell exactly which (email) field is duplicate
  */

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
