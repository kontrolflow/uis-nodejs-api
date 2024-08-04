// Imports for API Routing
const express = require('express');
const AutoTaskAPI = require('../serviceProviders/AutoTaskAPI');
const router = express.Router();

router.post('/5000-successful-backup-event', async (req, res) => {

    console.log("Webhook Route")
    console.log("5000 - Successful Backup Event")
    console.log(req.body)
    persistPayload(req.body)

    // Prep Data
    const device_hostname = req.body.device_hostname
    let foundTicket = false

    // Find All Open Tickets Matching VM Local Backup Copy Failed
    const matches = await AutoTaskAPI.getOpenTicketsMatchingTitle("VM Local Backup Failed")
    // console.log(matches)
    
    // Loop Through Matches Looking for the Hostname in the Description
    matches.forEach(ticket => {
        console.log(device_hostname)
        console.log(ticket)
        if(ticket.description.includes(device_hostname)) {
            foundTicket = ticket
        }
    });

    // If ticket is found, add billing and mark as complete
    if(foundTicket) {
        console.log("Matching Ticket Found")

        // Add a 15 Minute Time Entry w/ Note
        const date =  new Date();
        const readableTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        const readableDate = date.toDateString()
        const billingEntryNote = "Confirmed a successful local backup occurence proceeding this failure.\r\n\r\n - Backup time was on " + readableDate + " at " + readableTime + "\r\n\r\n"
        AutoTaskAPI.addBillingToTicket(foundTicket.id, billingEntryNote, 15)

        // Complete the Ticket
        const fields = { status:5 }
        AutoTaskAPI.updateTicket(foundTicket.id, fields)

    } else {
        console.log("No ticket found")
    }

    res.status(200).send("Webhook Triggered / 5000 - Successful Backup Event")

})

router.post('/5003-successful-restore-or-verification-event', async (req, res) => {

    console.log("Webhook Route")
    console.log("5003 - Successful Backup Event")
    console.log(req.body)
    persistPayload(req.body)

    // Prep Data
    const device_hostname = req.body.device_hostname
    let foundTicket = false

    // Find All Open Tickets Matching VM Backup - Failed Restore or Verification
    const matches = await AutoTaskAPI.getOpenTicketsMatchingTitle("VM Backup - Failed Restore or Verification")
    // console.log(matches)
    
    // Loop Through Matches Looking for the Hostname in the Description
    matches.forEach(ticket => {
        console.log(device_hostname)
        console.log(ticket)
        if(ticket.description.includes(device_hostname)) {
            foundTicket = ticket
        }
    });

    // If ticket is found, add billing and mark as complete
    if(foundTicket) {
        console.log("Matching Ticket Found")

        // Add a 15 Minute Time Entry w/ Note
        const date =  new Date();
        const readableTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        const readableDate = date.toDateString()
        const billingEntryNote = "Confirmed a successful restore/verification occurence proceeding this failure.\r\n\r\n - Restore/verification was on " + readableDate + " at " + readableTime + "\r\n\r\n"
        AutoTaskAPI.addBillingToTicket(foundTicket.id, billingEntryNote, 30)

        // Complete the Ticket
        const fields = { status:5 }
        AutoTaskAPI.updateTicket(foundTicket.id, fields)

    } else {
        console.log("No ticket found")
    }

    res.status(200).send("Webhook Triggered / 5003 - Successful Restore or Verification Event")

})

router.post('/5005-successful-offsite-copy-event', async (req, res) => {

    console.log("Webhook Route")
    console.log("5005 - Successful Offsite Copy Event")
    console.log(req.body)
    persistPayload(req.body)

    // Prep Data
    const device_hostname = req.body.device_hostname
    let foundTicket = false

    // Find All Open Tickets Matching VM Backup Offsite Copy Failed 
    const matches = await AutoTaskAPI.getOpenTicketsMatchingTitle("VM Backup Offsite Copy Failed")
    // console.log(matches)
    
    // Loop Through Matches Looking for the Hostname in the Description
    matches.forEach(ticket => {
        console.log(device_hostname)
        console.log(ticket)
        if(ticket.description.includes(device_hostname)) {
            foundTicket = ticket
        }
    });

    // If ticket is found, add billing and mark as complete
    if(foundTicket) {
        console.log("Matching Ticket Found")

        // Add a 15 Minute Time Entry w/ Note
        const date =  new Date();
        const readableTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        const readableDate = date.toDateString()
        const billingEntryNote = "Confirmed a successful offsite backup occurence proceeding this failure.\r\n\r\n - Offsite backup was on " + readableDate + " at " + readableTime + "\r\n\r\n"
        AutoTaskAPI.addBillingToTicket(foundTicket.id, billingEntryNote, 30)

        // Complete the Ticket
        const fields = { status:5 }
        AutoTaskAPI.updateTicket(foundTicket.id, fields)

    } else {
        console.log("No ticket found")
    }

    res.status(200).send("Webhook Triggered / 5005 - Successful Offsite Copy Event")

})

async function persistPayload(payload) {

    return new Promise(resolve => {

        const axios = require('axios');

        const url = "https://prod-188.westus.logic.azure.com:443/workflows/280b8a022ed541559e63eac114ab7d5b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2zhKa5ZNtRFKz8lamGyrWBZf95Ch64bYRIdadhQdFPw"

        var options = {
            headers: {
                'Content-Type': 'application/json',
            }
        }


        axios.post(url, payload, options)
            .then(res=> {
                console.log(res.data)
                if(res.data) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
            .catch(err=> {
                resolve(false)
                console.log(err)
                console.log(err.response.data.errors)
            })

    })

}

module.exports = router