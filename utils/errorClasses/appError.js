// feature modules
const BaseError = require('./baseError');
const { ERROR_INFO } = require('./errorConstants');

//this class will handle operational errors
class AppError extends BaseError {
  constructor(customError) {
    let customErrorCode = customError.httpCode
    if (!customErrorCode)
      throw new Error('Invalid call to AppError');

    super(customErrorCode);
    // add custom properties to error object
    this.httpCode = ERROR_INFO[customErrorCode].httpCode; // http status code    
    this.errorDescription = ERROR_INFO[customErrorCode].errorDescription; //Message describing the error
    this.type = ERROR_INFO[customErrorCode].type; //error type or error origin
    this.errorUserTitle = ERROR_INFO[customErrorCode].errorUserTitle; //error title for user
    this.errorUserMsg = ERROR_INFO[customErrorCode].errorUserMsg; //error msg for user
  }
}

module.exports = AppError;