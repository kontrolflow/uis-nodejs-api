const DattoAPI = require('../serviceProviders/DattoAPI')

// Datto RMM Model

class DattoAlert {

    constructor(alert) {
        this.alertUid = alert.alertUid
        this.timestamp = alert.timestamp
    }

    resolveAlertIfOlderThanThirtyDays() {
        return new Promise(async resolve => {

            // Prep Response
            let res = { status: null, message: [] }

            // Get Timestamp of 30 Days ago
            const now = Date.now()
            const thirtyDays = 30 * 24 * 60 * 60 * 1000
            const thirtyDaysAgo = now - thirtyDays

            // Resolve Alert if Older than 30 Days
            if( this.timestamp < thirtyDaysAgo ) {

                // Add message to responce
                res.message.push('Alert Older than 30 Days')

                // Perform API Call to Resolve
                const endpoint = "/alert/" + this.alertUid + "/resolve"
                const resolveResponse = await DattoAPI.post(endpoint, {})
                console.log(resolveResponse)

                // Filter through the API Call Response
                switch(resolveResponse.status) {
                    case 200:
                        res.message.push("Resolved Alert: " + this.alertUid )
                        res.status = true
                        resolve(res)
                        break;
                    default:
                        res.message.push("Unable to Resolve Alert (Unknown Error): " + this)
                        res.status = false
                        resolve(res)
                        break;
                }
            } else {
                res.message.push("Timestamp younger than 30 days")
                res.status = false
                resolve(res)
            }

        })
    }

    // Getter Methods
    static getAllOpenThirtyDayOldAlerts() {

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
            const thirtyDays = 30 * 24 * 60 * 60 * 1000
            const thirtyDaysAgo = now - thirtyDays
    
            // console.log(thirtyDaysAgo)

            // Filter Array for Alerts Older than 30 Days
            const oldAlerts = openAlertsArrayJSON.filter(alert => alert.timestamp < thirtyDaysAgo)

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
            console.log(oldAlerts[1])

            resolve(oldAlertObjects)
        })

    }

}

module.exports = DattoAlert