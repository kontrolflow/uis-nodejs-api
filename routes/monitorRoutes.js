// Imports for API Routing
const express = require('express');
const router = express.Router();

// const DattoAlert = require('../models/DattoAlert')

router.get('/autotask-integration', async (req, res) => {
    console.log("Testing AutoTask Integration")

    const AutoTaskAPI = require('../serviceProviders/AutoTaskAPI')
    const company = await AutoTaskAPI.getCompanyOfIdZero()

    if(company.companyName == "Umbrella IT Solutions") {
        res.status(200).send("Auto Task Integration Test Succeeded")
    } else {
        res.status(500).send("Auto Task Integration Test Failed")
    }
    
    console.log(req.url)
})

// General Webhook for datto (GET)
// router.get('/webhook', async (req, res) => {
//     console.log("API Notified of Datto Webhook")
//     res.status(200).send("API Notified of Datto Webhook")
//     console.log(req.url)
// })

// General Webhook for datto (POST)
// router.post('/webhook', async (req, res) => {
//     console.log("API Notified of Datto Webhook")
//     res.status(200).send("API Notified of Datto Webhook")
//     console.log(req.url)
//     console.log(req.body)
// })

module.exports = router