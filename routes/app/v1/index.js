/**
 * index.js
 * @description :: index route file of app platform.
 */

const express =  require('express');
const router =  express.Router();
router.use(require('./userRoutes'));

module.exports = router;
