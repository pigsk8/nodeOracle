const express = require('express');

const router = express.Router();

const oracleExample = require('../repositories/oracleExample');

router.get('/test', async (req, res) => {

    await oracleExample.queryExample();
    await oracleExample.procedureExample();
    await oracleExample.functionExample();

    res.json({ test: 'GET request'});
});

module.exports = router;
