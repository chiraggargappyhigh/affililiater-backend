
/*
1. we allocate a custom error code for each known errors
2. we create ERROR_INFO for each custom error code. basically we define our known error.
3. we import all modules ERROR_CODES and ERROR_INFO here to access them in complete application from a single place. 
*/

// feature modules
const { httpCode, httpMessage } = require('./http');

const ERROR_CODES = {
  ROUTE_NOT_FOUND: 1000,
  OBJECT_NOT_FOUND: 1001,

  REQUEST_BODY_INVALID: 1002,
  REQUEST_QUERY_INVALID: 1003,
  REQUEST_PARAMS_INVALID: 1004,

  INTERNAL_SERVER_ERROR: 1005,
  JWT_TOKEN_ERROR: 1006,
  AUTH_TOKEN_REQUIRED: 1007,
  UNPROCESSABLE_ENTITY: 422,
  CUSTOM_ERROR: 500
};

//httpCode, errorDescription, type, errorUserTitle, errorUserMsg
const ERROR_INFO = {
  [ERROR_CODES.ROUTE_NOT_FOUND]: {
    errorDescription: 'API route not found',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.NOT_FOUND],
    httpCode: httpCode.NOT_FOUND
  },
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    errorDescription: 'Internal server error',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.INTERNAL_SERVER_ERROR],
    httpCode: httpCode.INTERNAL_SERVER_ERROR
  },
  [ERROR_CODES.OBJECT_NOT_FOUND]: {
    errorDescription: 'Object not found',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.NOT_FOUND],
    httpCode: httpCode.NOT_FOUND
  },
  [ERROR_CODES.REQUEST_BODY_INVALID]: {
    errorDescription: 'Invalid body in request',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.BAD_REQUEST],
    httpCode: httpCode.BAD_REQUEST
  },
  [ERROR_CODES.REQUEST_QUERY_INVALID]: {
    errorDescription: 'Invalid query in request',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.BAD_REQUEST],
    httpCode: httpCode.BAD_REQUEST
  },
  [ERROR_CODES.REQUEST_PARAMS_INVALID]: {
    errorDescription: 'Invalid params in API route',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.BAD_REQUEST],
    httpCode: httpCode.BAD_REQUEST
  },
  [ERROR_CODES.JWT_TOKEN_ERROR]: {
    errorDescription: 'JWT token error',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.UNAUTHORIZED],
    httpCode: httpCode.UNAUTHORIZED
  },
  [ERROR_CODES.AUTH_TOKEN_REQUIRED]: {
    errorDescription: 'Auth token required',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.UNAUTHORIZED],
    httpCode: httpCode.UNAUTHORIZED
  },
  [ERROR_CODES.UNPROCESSABLE_ENTITY]: {
    errorDescription: 'Parameters required',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.UNPROCESSABLE_ENTITY],
    httpCode: httpCode.UNPROCESSABLE_ENTITY
  },
  [ERROR_CODES.CUSTOM_ERROR]: {
    errorDescription: 'Internal server error',
    type: '',
    errorUserTitle: '',
    errorUserMsg: httpMessage[httpCode.INTERNAL_SERVER_ERROR],
    httpCode: httpCode.INTERNAL_SERVER_ERROR
  },
};

module.exports = {
  ERROR_CODES,
  ERROR_INFO
};
