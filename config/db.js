/**
 * db.js
 * @description :: exports database connection using mongoose
 */

const mongoose = require('mongoose');
const sendSlackAlert = require('../utils/helpers/slackAlert');
const uri = process.env.NODE_ENV === 'test' ? process.env.DB_TEST_URL : process.env.DB_URL;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
});
let db = mongoose.connection;

db.once('open', () => {
  if (process.env.ENV != "DEV") {
    sendSlackAlert(`DB is up now on ${process.env.ENV}. 🚀🚀`)
  }
  console.log('Connection Successful');
});

db.on('error', (error) => {
  if (process.env.ENV != "DEV") {
    sendSlackAlert(`Failure alert on ${process.env.ENV} for mongo DB connection. Please take action.`)
  }
  console.log('Error in mongodb connection', error);
});

db.on('disconnected', () => {
  if (process.env.ENV != "DEV") {
    sendSlackAlert(`Disconnect alert on ${process.env.ENV} for mongo DB server.`)
  }
  console.log('Disconnected from MongoDB server');
});

module.exports = mongoose;