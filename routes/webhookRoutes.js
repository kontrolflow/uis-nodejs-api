// Imports for API Routing
const express = require('express');
const router = express.Router();

router.post('/5000-successful-backup-event', async (req, res) => {

    console.log("Webhook Route")
    console.log("5000 - Successful Backup Event")
    console.log(req.body)

    res.status(200).send("Webhook Triggered / 5002 - Successful Backup Event")

})

router.post('/5003-successful-restore-or-verification-event', async (req, res) => {

    console.log("Webhook Route")
    console.log("5003 - Successful Backup Event")
    console.log(req.body)

    res.status(200).send("Webhook Triggered / 5003 - Successful Restore or Verification Event")

})

router.post('/5005-successful-offsite-copy-event', async (req, res) => {

    console.log("Webhook Route")
    console.log("5005 - Successful Offsite Copy Event")
    console.log(req.body)

    res.status(200).send("Webhook Triggered / 5005 - Successful Offsite Copy Event")

})

module.exports = router