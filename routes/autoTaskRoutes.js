// Imports for API Routing
const express = require('express');
const router = express.Router();

// Get Stream
router.get('/', async (req, res) => {

    console.log("Here")
    res.status(200).send("autoTaskRoutes Root")

})

// Webhook for when a ticket gets created
router.get('/ticket', async (req, res) => {
    console.log("API Notified of Ticket Creation")
    res.status(200).send("API Notified of Ticket Creation")
    console.log(req.url)
})

// Webhook for when a ticket gets created but a company was not found
// This webhook should just try to find the company for the ticket and auto update if found
router.get('/company-not-found', async (req, res) => {

    // AutoTask hits this endpoint if a ticket is created without a company
    res.status(200).send("Company Not Identified - Web Hook Triggered")
    console.log('/get-ticket (Route)')
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

})

// This is a required webhook for AutoTask. Has no function other than existing atm
router.get('/deactivate', async (req, res) => {
    console.log("Webhook Deactivated")
    res.status(200).send("Webhook Deactivated")
})

router.get('/create-test-tickets', async (req, res) => {

    console.log("Creating Test Tickets")

    const Email = require('../serviceProviders/Email')

    Email.send('support@umbrellaitgroup.com', 'Test X - Please Ignore - Ivantsov.tech', '9043219777')

    Email.send('support@umbrellaitgroup.com', 'Test X - Please Ignore - Lindell & Farson, PA', '9043219777')

    Email.send('support@umbrellaitgroup.com', 'Test X - Please Ignore - Vicars Landing', '9043219777')

    Email.send('support@umbrellaitgroup.com', 'Test X - Please Ignore - Vicars + Somthing Else', '9043219777')

    Email.send('support@umbrellaitgroup.com', 'Test X - Please Ignore - InDepth Environmental Inc.', '9043219777')

    // Email.send('support@umbrellaitgroup.com', 'Voicemail', 'Testing 123...')

    // Email.send('support@umbrellaitgroup.com', 'Meraki - Please Ignore', 'Testing 123...')

    
    // if(await Email.send('support@umbrellaitgroup.com', 'Testing - Please Ignore', 'Testing 123...') == true) {
    //     console.log('Email sent successfully');
        res.status(200).send("Email sent successfully")
    // } else {
    //     console.log('Error Occurs');
    //     res.status(200).send("Error Occurs")
    // }
    // https://ww14.autotask.net/Autotask/AutotaskExtend/ExecuteCommand.aspx?Code=OpenTicketDetail&TicketID=37708

})

module.exports = router