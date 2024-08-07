
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


router.get('/old-alert-resolver', async (req, res) => {
    
    var response = {message:[]}
    response.route = "/trigger/old-alert-resolver"


    const oldAlerts = await DattoAlert.getAllOpenSixtyDayOldAlerts()
    response.oldAlertCount = oldAlerts.length

    if(oldAlerts.length === 0) {

        // Zero/No Old Alerts Found
        response.message.push("No Old Alerts Found")
        res.status(200).send(response)
        return

    } else {

        // 1 or More Old Alerts Found
        response.message.push(oldAlerts.length + "No Old Alerts Found")
        response.message.push("Resolving Old Alerts Found")
        response.totalResolved = 0
        response.totalUnresolved = 0
    
        var forEach = new Promise((resolve, reject) => {
            oldAlerts.forEach(async (alert, index, array) => {
                const resolved = await DattoAlert.resolveAlertIfOlderThanSixtyDays(alert)
                // console.log(resolved)
                if(resolved.status) {
                    // console.log(response)
                    response.totalResolved ++
                } else {
                    response.totalUnresolved ++
                }
                if (index === array.length -1) resolve();
            })
        });
        
        forEach.then(() => {
            console.log(response)
            res.status(200).send(response)
            return
        });

    }

})

module.exports = router