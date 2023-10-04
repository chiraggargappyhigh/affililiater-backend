// dependency library
require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  environment: process.env.ENV,
//   allowedHosts: process.env.ALLOWED_HOSTS,
  mongoUrl: process.env.DB_URL,
//   adminServer: process.env.ADMIN_SERVER,
  prodBaseUrl: process.env.HOST,
  iofloodBaseUrl: process.env.HOST,
  appName: process.env.APP_NAME,
//   pingRequestIntervalTime: process.env.PING_REQUEST_INTERVAL_TIME,
//   defaultPackageId: process.env.DEFAULT_PACKAGEID,
//   criticalSlackAlert: process.env.CRITICAL_SLACK_ALERTS,
  errorHandlerDbName: process.env.ERROR_HANDLER_DB_NAME,
  errorHandlerDbUrl: process.env.DB_URL
};
