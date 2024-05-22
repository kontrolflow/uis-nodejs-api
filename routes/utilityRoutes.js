// Imports for API Routing
const express = require('express');
const router = express.Router();

router.post('/riq-parse-lead-email', async (req, res) => {
    console.log(req.body['lead-email-body'])
    res.send("Parsing Lead Email")
})

module.exports = router