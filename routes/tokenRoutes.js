// Imports for API Routing
const express = require('express');
const DattoAPI = require('../serviceProviders/DattoAPI');

const router = express.Router();

router.patch('/datto', async (req, res) => {

    console.log("Route: Patch Datto API Token")
    console.log(req.body)
    console.log(req.headers.authorization)

    //////////// Authenticate the API User ////////////

    // No Token Provided
    if(!req.headers.authorization) {
        res.status(401).send("No Access Token Provided")
        return
    
    // Token Provided
    } else {
        const accessToken = req.headers.authorization.replace("Bearer ", "")

        // Incorrect Access Token
        if(accessToken != process.env.POWER_AUTOMATE_API_TOKEN) {
            res.status(401).send("Incorrect Access Token Provided")
            return
        }
    }

    //////////// Successfully Authenticated. Inspect the New Datto API Token ////////////

    // No New Datto API Token Provided
    if(!req.body.newDattoApiToken) {
        res.status(400).send("Authenticated but no new Datto API Token Provided")
        return
    }

    const newDattoApiToken = "Bearer " + req.body.newDattoApiToken

    // Invalid Datto API Token Provided
    if(await DattoAPI.validateToken(newDattoApiToken) == false) {
        res.status(400).send("Authenticated but invalid Datto API Token Provided")
        return
    }

    // Valid Datto API Token Provided
    if(await DattoAPI.validateToken(newDattoApiToken) == true) {

        // But don't edit if in "test" deployment mode
        if(process.env.DEPLOYMENT_MODE === "test") {
            res.status(200).send("Authenticated and valid Datto API Token Provided")
            return
        } else {
            // Token is valid, edit the .env file
            const fs = require('fs') 
            const { parse, stringify } = require('envfile')

            const sourcePath = './.env'
            console.log(parse(fs.readFileSync(sourcePath, 'utf8')))
            let parsedFile = parse(fs.readFileSync(sourcePath, 'utf8'))
            parsedFile.DATTO_API_KEY = newDattoApiToken
            fs.writeFileSync(sourcePath, stringify(parsedFile)) 

            const { exec } = require("child_process");

            if(process.env.DEPLOYMENT_MODE == "prod") {
                exec("sudo pm2 restart uis-nodejs-api", (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
            }

            res.status(200).send("Authenticated and valid Datto API Token Provided")
            return
        }

    }

})

module.exports = router