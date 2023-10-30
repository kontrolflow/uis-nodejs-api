// Imports for API Routing
const express = require('express');
const router = express.Router();

// Database Import
// const DB = require("../serviceProviders/DB")

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

router.get('/get-ticket', async (req, res) => {
    
    console.log('/get-ticket (Route)')

    const AutoTaskTicket = require('../models/AutoTaskTicket')

    const ticket = new AutoTaskTicket(37708)
    
    if(await ticket.init()) {
        console.log(ticket)
    }

})

router.get('/update-ticket', async (req, res) => {
    
    console.log('/update-ticket (Route)')

    const AutoTaskTicket = require('../models/AutoTaskTicket')

    const ticket = new AutoTaskTicket(37711)

    const updates = {
        description: "Updated Again",
        title: "Test - Don't Delete Me - Updated Again"
    }

    if(await ticket.update(updates)) {
        console.log("Ticket Updated Successfully")
        console.log(ticket)
    }

})
    
router.get('/get-ticket-2', async (req, res) => {

    // https://ww14.autotask.net/Autotask/AutotaskExtend/ExecuteCommand.aspx?Code=OpenTicketDetail&TicketID=37258
    // https://ww14.autotask.net/Autotask/AutotaskExtend/ExecuteCommand.aspx?Code=OpenTicketDetail&TicketID=37679


    const {AutotaskRestApi} = require('@apigrate/autotask-restapi');

    const autotask = await new AutotaskRestApi(
        process.env.AUTOTASK_USER, // make sure it's an API User
        process.env.AUTOTASK_SECRET, 
        process.env.AUTOTASK_INTEGRATION_CODE 
    );

    let api = await autotask.api();
    let ticket = await api.Tickets.get(37679);//Get the root company
    console.log(ticket)
})

router.get('/db-connection', async (req, res) => {

    // console.log(Mongo)

    const db = new DB()

    const result = await db.query().collection("Users").find({}).toArray()
    
    if (result) {
        // console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log("No Result");
    }
    
    db.close()

    res.send("MongoDB")

})

module.exports = router