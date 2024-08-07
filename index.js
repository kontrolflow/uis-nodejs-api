require('dotenv').config()
const express = require('express')
var cors = require('cors')
const http = require('http');

const clients = require('./clients.json');

const app = express()

app.use(express.json())

////////////    Add Headers    ////////////
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next();
})

// app.use(cors())

const webhookRoutes = require('./routes/webhookRoutes')
app.use('/webhook', webhookRoutes)

const triggerRoutes = require('./routes/triggerRoutes')
app.use('/trigger', triggerRoutes)

const autoTaskRoutes = require('./routes/autoTaskRoutes')
app.use('/autoTask', autoTaskRoutes)

const dattoRoutes = require('./routes/dattoRoutes')
app.use('/datto', dattoRoutes)

const monitorRoutes = require('./routes/monitorRoutes')
app.use('/monitor', monitorRoutes)

const utilityRoutes = require('./routes/utilityRoutes')
app.use('/utilities', utilityRoutes)

const testRoutes = require('./routes/testRoutes')
app.use('/test', testRoutes)


app.get('/clients', (req, res) => {
    if(req.query.apiKey === process.env.USER_API_KEY) {
        console.log("Authenticated")
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(clients));
    } else {
        console.log("Not Authenticated")
        res.status(403).end()
    }
})

app.get('/quick-five', async (req, res) => {
    console.log("here")
    const OpenAI = require("./serviceProviders/OpenAI")
    let answers = await OpenAI.getFive()

    res.json({responses: [
        answers[1],
        answers[2],
        answers[3]
    ]})
})


// Rem
app.get('/prompt', async (req, res) => {
    // console.log(req.query.apiKey)
    // console.log(req.query.prompt)

    if(req.query.apiKey === process.env.USER_API_KEY) {
        console.log("Authenticated")
        const OpenAI = require("./serviceProviders/OpenAI")
        let response = await OpenAI.prompt(req.query.prompt)
        console.log("Response:" + response)
        res.send(response)
    } else {
        console.log("Not Authenticated")
        res.status(403).end()
    }

})

switch(process.env.DEPLOYMENT_MODE) {

    case "dev":

        console.log("Starting UIS-NodeJS-API in Development Mode")
        const httpServer = http.createServer(app);
        httpServer.listen(80, () => {
            console.log('HTTP Server running on port 80');
        });
        break;

    case "prod":

        console.log("Starting UIS-NodeJS-API in Development Mode")
        const httpProdServer = http.createServer(app);
        httpProdServer.listen(3001, () => {
            console.log('HTTP Server running on port 3001');
        });
        break;

    default:

        console.log("Server Failed to Start - Issue with Deployment Mode")

}