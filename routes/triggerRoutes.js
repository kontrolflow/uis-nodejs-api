

//############################################//
//                                            //
//       Routes for Function Triggering       //
//                                            //
//############################################//


// Imports for API Routing
const express = require('express');
const router = express.Router();

// App Imports
const DattoAlert = require('../models/DattoAlert')

// Sanity Check 
router.get('/old-alert-resolver', async (req, res) => {
    
    console.log("Route: /trigger/old-alert-resolver")
    console.log(req.url)

    const oldAlerts = await DattoAlert.getAllOpenSixtyDayOldAlerts()

    var response = {
        message: "Deleting Alerts 60 Days Old and Older",
        count: oldAlerts.length,
        totalResolved: 0,
        totalUnresolved: 0
    }

    var forEach = new Promise((resolve, reject) => {
        oldAlerts.forEach(async alert => {
            const resolved = await DattoAlert.resolveAlertIfOlderThanSixtyDays(alert)
            // console.log(resolved)
            if(resolved.status) {
                // console.log(response)
                response.totalResolved ++
            } else {
                response.totalUnresolved ++
            }
        })
        resolve()
    });
    
    forEach.then(() => {
        console.log(response)
        res.status(200).send(response)
    });

})

module.exports = router