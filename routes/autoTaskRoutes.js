// Imports for API Routing
const express = require('express');
const router = express.Router();

// // App Imports
// const DB = require("../serviceProviders/DB")

// // Get Stream
// router.get('/', async (req, res) => {

//     console.log("Here")
//     res.status(200).send("autoTaskRoutes Root")

// })

// Webhook for when a ticket gets created
// router.get('/ticket', async (req, res) => {
//     console.log("Ticket Creation Webhook Hit")
//     res.status(200).send("API Notified of Ticket Creation")

//     const db = new DB()
//     const result = await db.query().collection("TicketCreatedWebhookEntries").insertOne({
//         url: req.url
//     })
    
//     if (result) {
//         console.log("The following entry was saved:")
//         console.log(result);
//     } else {
//         console.log("No result from saving:");
//         console.log(result);
//     }

//     db.close()

// })

// Webhook for when a ticket gets created but a company was not found
// This webhook should just try to find the company for the ticket and auto update if found
router.get('/company-not-found', async (req, res) => {

    // AutoTask hits this endpoint if a ticket is created without a company
    res.status(200).send("Company Not Identified - Web Hook Triggered")
    console.log('/autotask/company-not-found (Route)')
    console.log(req.url)

    // Get Ticket ID
    const id = req.query.id

    // Instantiate Ticket
    const AutoTaskTicket = require('../models/AutoTaskTicket')
    const ticket = new AutoTaskTicket(id)
    ticket.init()

    // Attempt to Auto Determine the Company of a Ticket
    if(await ticket.autoFindCompany()) {
        console.log("Company Determined")
    } else {
        console.log("Unable to Determine Company")
    }

    // if(await ticket.processCompanyNotFoundTicket()) {
    //     console.log("Ticket Processed")
    // } else {
    //     console.log("Unable to Process Ticket")
    // }

})

// This is a required webhook for AutoTask. Has no function other than existing atm
router.get('/deactivate', async (req, res) => {
    console.log("Webhook Deactivated")
    res.status(200).send("Webhook Deactivated")
})

module.exports = router