// Imports for API Routing
const express = require('express');
const DattoAPI = require('../serviceProviders/DattoAPI');
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

router.get('/datto-token-validation', async (req, res) => {
    
    if(await DattoAPI.validateToken(process.env.DATTO_API_KEY)) {
        res.status(200).send("Datto Token Valid")
    } else {
        res.status(500).send("Datto Token Invalid")
    }

})


module.exports = router