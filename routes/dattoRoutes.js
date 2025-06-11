
// ╔═══╗──╔╗─╔╗────╔═══╗─────╔╗────╔═══╗─────╔╗─────╔╗╔╗
// ╚╗╔╗║─╔╝╚╦╝╚╗───║╔═╗║────╔╝╚╗───║╔═╗║────╔╝╚╗────║║║║
// ─║║║╠═╩╗╔╩╗╔╬══╗║╚═╝╠══╦╗╠╗╔╬══╗║║─╚╬══╦═╬╗╔╬═╦══╣║║║╔══╦═╗
// ─║║║║╔╗║║─║║║╔╗║║╔╗╔╣╔╗║║║║║║║═╣║║─╔╣╔╗║╔╗╣║║╔╣╔╗║║║║║║═╣╔╝
// ╔╝╚╝║╔╗║╚╗║╚╣╚╝║║║║╚╣╚╝║╚╝║╚╣║═╣║╚═╝║╚╝║║║║╚╣║║╚╝║╚╣╚╣║═╣║
// ╚═══╩╝╚╩═╝╚═╩══╝╚╝╚═╩══╩══╩═╩══╝╚═══╩══╩╝╚╩═╩╝╚══╩═╩═╩══╩╝

// Imports for API Routing
const express = require('express');
const router = express.Router();

// App Imports
const DattoAlert = require('../models/DattoAlert')
const DattoDevice = require('../models/DattoDevice')
// const DB = require("../serviceProviders/DB")


// General Webhook for datto (GET)
router.get('/webhook', async (req, res) => {
    console.log("Datto Webhook hit by GET request")
    res.status(200).send("API Notified of Datto Webhook")
    console.log(req.url)
})

// General Webhook for datto (POST)
// router.post('/webhook', async (req, res) => {
    
//     console.log("Datto Webhook hit by POST request")
//     res.status(200).send("Datto Webhook Triggered")

//     const db = new DB()
//     const result = await db.query().collection("DattoWebhookEntries").insertOne(req.body)
    
//     if (result) {
//         console.log("The following entry was saved:")
//         console.log(result);
//     } else {
//         console.log("No result from saving:");
//         console.log(result);
//     }

//     db.close()
// })

// Sanity Check 
router.get('/get-30-day-alerts', async (req, res) => {
    
    console.log("Route: /datto/get-30-day-alerts")
    console.log(req.url)

    if(req.query.apiKey === process.env.USER_API_KEY) {

        const oldAlerts = await DattoAlert.getAllOpenThirtyDayOldAlerts()
        let response = {
            message: "Getting Alerts 30 Days Old and Older",
            count: oldAlerts.length,
            alerts: oldAlerts
        }
        console.log(oldAlerts.length)
        res.status(200).send(response)

    } else {
        console.log("Not Authenticated")
        res.status(403).end()
    }

})

//Resolve the Alerts
// router.get('/clear-30-day-alerts', async (req, res) => {
//     console.log("Route: /datto/clear-30-day-alerts")
//     console.log(req.url)


//     if(req.query.apiKey === process.env.USER_API_KEY) {
//         let response = {
//             message: "Clearing Alerts 30 Days Old and Older"
//         }
    
//         const oldAlerts = await DattoAlert.getAllOpenThirtyDayOldAlerts()
//         response.alertCount = oldAlerts.length
//         response.totalResolved = 0
//         response.totalUnresolved = 0
    
//         oldAlerts.forEach(async alert => {
//             const resolved = await alert.resolveAlertIfOlderThanThirtyDays()
//             if(resolved.status) {
//                 response.totalResolved ++
//             } else {
//                 response.totalUnresolved ++
//             }
//         })
    
//         res.status(200).send(response)
//     } else {
//         console.log("Not Authenticated")
//         res.status(403).end()
//     }
    
// })

router.get('/getAllDevices', async (req, res) => {
    
    console.log("Route: /datto/getAllDevices")
    console.log(req.url)

    if(req.query.apiKey === process.env.USER_API_KEY) {

        const devices = await DattoDevice.getAllDevices()
        let response = {
            message: "Getting All Datto Devices",
            count: devices.length,
            alerts: devices
        }
        console.log(devices.length)
        res.status(200).send(response)

    } else {
        console.log("Not Authenticated")
        res.status(403).end()
    }

})

router.get('/getCurrentDevices', async (req, res) => {
    
    console.log("Route: /datto/GetCurrentDevices")
    console.log(req.url)

    if(req.query.apiKey === process.env.USER_API_KEY) {

        const allDevices = await DattoDevice.getAllDevices()

        let cutoffEpochTime = getEpochDaysAgo(90)

        let devices = allDevices.filter(device => device.lastSeen > cutoffEpochTime)

        let response = {
            message: "Getting Datto Devices Last Seen Over 90 Days Ago",
            count: devices.length,
            devices: devices
        }
        console.log(devices.length)
        res.status(200).send(response)

    } else {
        console.log("Not Authenticated")
        res.status(403).end()
    }

})

router.get('/getDevicesOffline90Days', async (req, res) => {
    
    console.log("Route: /datto/getDevicesOffline90Days")
    console.log(req.url)

    if(req.query.apiKey === process.env.USER_API_KEY) {

        const allDevices = await DattoDevice.getAllDevices()

        let cutoffEpochTime = getEpochDaysAgo(90)

        let devices = allDevices.filter(device => device.lastSeen < cutoffEpochTime)

        let response = {
            message: "Getting Datto Devices Last Seen Over 90 Days Ago",
            count: devices.length,
            devices: devices
        }
        console.log(devices.length)
        res.status(200).send(response)

    } else {
        console.log("Not Authenticated")
        res.status(403).end()
    }

})

function getEpochDaysAgo(days) {
  const now = Date.now(); // current time in milliseconds
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return now - (days * millisecondsPerDay);
}

module.exports = router