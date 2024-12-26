const express = require('express')
const router = express.Router();
const convertJsonToExcel = require('../Controllers/jsonToExcel.controller');

router.get('/fetch-and-convert', convertJsonToExcel);

module.exports = router;