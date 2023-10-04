
class BaseError extends Error {
  constructor(customErrorCode) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  
    this.customErrorCode = customErrorCode;
  
    Error.captureStackTrace(this);
  }
 }

 module.exports = BaseError;