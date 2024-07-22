// Imports for API Routing
const express = require('express');
const router = express.Router();

router.post('/riq-parse-lead-email', async (req, res) => {
    // console.log(req.body['lead-email-body'])

    // Strip data of outside html tags
    const string = req.body['lead-email-body']
    const regexp = /<p>(.*)<\/p>/gm
    const matches = string.matchAll(regexp);
    let pTag = ''    
    for (const match of matches) {
        pTag = match[1]
        // console.log(match);
        // console.log(match.index)
    }

    // Split string of data into array using the '<br>' tag as a delimiter
    const leadArray = pTag.split('<br>')

    // Loop through array and prep json object of lead
    const lead = {}
    for (row of leadArray) {
        if(row === '') {
            // Do nothing with the row
        } else if(row.includes("Name:")) {
            const arr = row.split(":")
            const name = arr[1].trim().split(' ')
            lead['first-name'] = name[0]
            lead['last-name'] = name[1]
        } else if(row.includes("Date Time:")) {
            const date = row.replace("Date Time:", "")
            lead['date-time'] = date.trim()
            const arr = lead['date-time'].split(' ')
            const dateTimeString = arr[2] + ', ' + arr
            console.log("DateTimeString: " + dateTimeString)
            // const regex = /\(.*\)/gm;
            // const dateNoTimeZone = lead['date-time'].replace(regex, '')
            // const startTime = Date.parse(dateNoTimeZone)
            // console.log(dateNoTimeZone);
            // console.log("Start Time:" + startTime)
        } else if(row.includes("Notes:")) {
            const notes = row.replace("Notes:", "")
            lead['notes'] = notes.trim()
        } else {
            const arr = row.split(":")
            const key = arr[0].toString().toLowerCase().replaceAll(" ", "-")
            let val = ''
            if(arr[1]) {
                val = arr[1].trim()
            } else {
                val = arr[1]
            }
            lead[key] = val
        }
        // console.log(row)
    }
    console.log(lead)
    res.json(lead)
})

module.exports = router