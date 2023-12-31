const RESPONSE_CODES_AND_MESSAGES = {
  ACCEPTED: { message: "Accepted", code: 202 },
  BAD_GATEWAY: { message: "Bad Gateway", code: 502 },
  BAD_REQUEST: { message: "Bad Request", code: 400 },
  CONFLICT: { message: "Conflict", code: 409 },
  CONTINUE: { message: "Continue", code: 100 },
  CREATED: { message: "Created", code: 201 },
  EXPECTATION_FAILED: { message: "Expectation Failed", code: 417 },
  FAILED_DEPENDENCY: { message: "Failed Dependency", code: 424 },
  FORBIDDEN: { message: "Forbidden", code: 403 },
  GATEWAY_TIMEOUT: { message: "Gateway Timeout", code: 504 },
  GONE: { message: "Gone", code: 410 },
  HTTP_VERSION_NOT_SUPPORTED: {
    message: "HTTP Version Not Supported",
    code: 505,
  },
  IM_A_TEAPOT: { message: "I'm a teapot", code: 418 },
  INSUFFICIENT_SPACE_ON_RESOURCE: { message: "I'm a teapot", code: 419 },
  INSUFFICIENT_STORAGE: { message: "Insufficient Storage", code: 507 },
  INTERNAL_SERVER_ERROR: { message: "Server Error", code: 500 },
  LENGTH_REQUIRED: { message: "Length Required", code: 411 },
  LOCKED: { message: "Locked", code: 423 },
  METHOD_FAILURE: { message: "Method Failure", code: 420 },
  METHOD_NOT_ALLOWED: { message: "Method Not Allowed", code: 405 },
  MOVED_PERMANENTLY: { message: "Moved Permanently", code: 301 },
  MOVED_TEMPORARILY: { message: "Moved Temporarily", code: 302 },
  MULTI_STATUS: { message: "Multi-Status", code: 207 },
  MULTIPLE_CHOICES: { message: "Multiple Choices", code: 300 },
  NETWORK_AUTHENTICATION_REQUIRED: {
    message: "Network Authentication Required",
    code: 511,
  },
  NO_CONTENT: { message: "No Content", code: 204 },
  NON_AUTHORITATIVE_INFORMATION: {
    message: "Non Authoritative Information",
    code: 203,
  },
  NOT_ACCEPTABLE: { message: "Not Acceptable", code: 406 },
  NOT_FOUND: { message: "Not Found", code: 404 },
  NOT_IMPLEMENTED: { message: "Not Implemented", code: 501 },
  NOT_MODIFIED: { message: "Not Modified", code: 304 },
  OK_REQUEST: { message: "Ok Request", code: 200 },
  PARTIAL_CONTENT: { message: "Partial Content", code: 206 },
  PAYMENT_REQUIRED: { message: "Payment Required", code: 402 },
  PERMANENT_REDIRECT: { message: "Permanent Redirect", code: 308 },
  PRECONDITION_FAILED: { message: "Precondition Failed", code: 412 },
  PRECONDITION_REQUIRED: { message: "Precondition Required", code: 428 },
  PROCESSING: { message: "Processing", code: 102 },
  PROXY_AUTHENTICATION_REQUIRED: {
    message: "Proxy Authentication Required",
    code: 407,
  },
  REQUEST_HEADER_FIELDS_TOO_LARGE: {
    message: "Request Header Fields Too Large",
    code: 431,
  },
  REQUEST_TIMEOUT: { message: "Request Timeout", code: 408 },
  REQUEST_TOO_LONG: { message: "Request Entity Too Large", code: 413 },
  REQUEST_URI_TOO_LONG: { message: "Request-URI Too Long", code: 414 },
  REQUESTED_RANGE_NOT_SATISFIABLE: {
    message: "Requested Range Not Satisfiable",
    code: 416,
  },
  RESET_CONTENT: { message: "Reset Content", code: 205 },
  SEE_OTHER: { message: "See Other", code: 303 },
  SERVICE_UNAVAILABLE: { message: "Service Unavailable", code: 503 },
  SWITCHING_PROTOCOLS: { message: "Switching Protocols", code: 101 },
  TEMPORARY_REDIRECT: { message: "Temporary Redirect", code: 307 },
  TOO_MANY_REQUESTS: { message: "Too Many Requests", code: 429 },
  UNAUTHORIZED: { message: "Unauthorized", code: 401 },
  UNPROCESSABLE_ENTITY: { message: "Unprocessable Entity", code: 422 },
  UNSUPPORTED_MEDIA_TYPE: { message: "Unsupported Media Type", code: 415 },
  USE_PROXY: { message: "Use Proxy", code: 305 },
};

module.exports = { RESPONSE_CODES_AND_MESSAGES };
