const DattoAPI = require('../serviceProviders/DattoAPI')

// Datto RMM Model

class DattoAlert {

    constructor(alert) {
        this.alertUid = alert.alertUid
        this.timestamp = alert.timestamp
    }

    static resolveAlertIfOlderThanSixtyDays(alert) {
        return new Promise(async resolve => {

            // Prep Response
            let res = { status: null, message: [] }

            // Get Timestamp of 60 Days ago
            const now = Date.now()
            const sixtyDays = 60 * 24 * 60 * 60 * 1000
            const sixtyDaysAgo = now - sixtyDays

            // Resolve Alert if Older than 30 Days
            if( alert.timestamp < sixtyDaysAgo ) {

                // Add message to response
                res.message.push('Alert older than 60 days')
                // res.status = true
                // resolve(res)

                // Perform API Call to Resolve
                const endpoint = "/alert/" + alert.alertUid + "/resolve"
                const resolveResponse = await DattoAPI.post(endpoint, {})
                console.log(resolveResponse)

                // Filter through the API Call Response
                switch(resolveResponse.status) {
                    case 200:
                        res.message.push("Resolved Alert: " + alert.alertUid )
                        res.status = true
                        resolve(res)
                        break;
                    default:
                        res.message.push("Unable to Resolve Alert (Unknown Error): " + alert)
                        res.status = false
                        resolve(res)
                        break;
                }
                
            } else {
                res.message.push('Alert younger than 60 days')
                res.status = false
                resolve(res)
            }

        })
    }

    // Getter Methods
    static getAllOpenSixtyDayOldAlerts() {

        return new Promise(async resolve => {

            // Hit the API for the first 250 Alerts
            const res = await DattoAPI.get('/account/alerts/open')

            let openAlertsArrayJSON = res.alerts
            // console.log(res)
            // console.log(openAlertsArrayJSON)

            // If there's more alerts, get more
            if(res.pageDetails.nextPageUrl !== null) {
                let morePages = true
                let nextPageUrl = res.pageDetails.nextPageUrl
                while(morePages === true) {
                    const nextPageResults = await DattoAPI.getWithFullURL(nextPageUrl)
                    openAlertsArrayJSON.push(...nextPageResults.alerts)

                    if(nextPageResults.pageDetails.nextPageUrl !== null) {
                        nextPageUrl = nextPageResults.pageDetails.nextPageUrl
                    } else {
                        morePages = false
                    }
                    // console.log(nextPageResults)
                }
            }

            // Get Timestamp of 30 Days ago
            const now = Date.now()
            // console.log(now)
            const sixtyDays = 60 * 24 * 60 * 60 * 1000
            const sixtyDaysAgo = now - sixtyDays
    
            // console.log(thirtyDaysAgo)

            // Filter Array for Alerts Older than 30 Days
            const oldAlerts = openAlertsArrayJSON.filter(alert => alert.timestamp < sixtyDaysAgo)

            // Filter Array for Alerts Older than 30 Days
            // const newAlerts = openAlertsArrayJSON.filter(alert => alert.timestamp >= thirtyDaysAgo)

            // Turn array of alerts in json into an array of alert objects
            // Return array of objects
            const oldAlertObjects = []
            oldAlerts.forEach(alert => oldAlertObjects.push(new this(alert)))

            // Open Alert Totals
            // console.log(openAlertsArrayJSON.length)
            // console.log(oldAlerts.length)
            // console.log(newAlerts.length)
            // console.log(oldAlerts[1])

            resolve(oldAlertObjects)
        })

    }

}

module.exports = DattoAlert