class AutoTaskAPI {

    static getTicketDetails(id) {

        return  new Promise(resolve => {

            const axios = require('axios');

            console.log(id)

            const url = "https://webservices14.autotask.net/atservicesrest/v1.0/Tickets/" + id

            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'ApiIntegrationCode':process.env.AUTOTASK_INTEGRATION_CODE,
                    'UserName':process.env.AUTOTASK_USER,
                    'Secret':process.env.AUTOTASK_SECRET
                }
            }

            axios.get(url, config)
                .then(res=> resolve(res.data.item))
                .catch(err=> {
                    resolve(false)
                    console.log(err)
                })

        })

    }

    static async updateTicket(id, fieldsToUpdate) {

        return new Promise(resolve => {

            const axios = require('axios');

            console.log(id)

            const url = "https://webservices14.autotask.net/atservicesrest/v1.0/Tickets"

            var options = {
                headers: {
                    'Content-Type': 'application/json',
                    'ApiIntegrationCode':process.env.AUTOTASK_INTEGRATION_CODE,
                    'UserName':process.env.AUTOTASK_USER,
                    'Secret':process.env.AUTOTASK_SECRET
                }
            }

            const body = fieldsToUpdate

            body.id = id

            console.log(body)


            axios.patch(url, body, options)
                .then(res=> {
                    console.log(res.data)
                    if(res.data.itemId) {
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

    static getAllClients() {

        return new Promise(resolve => {

            const axios = require('axios');

            // console.log(id)

            const apiBaseURL = "https://webservices14.autotask.net/atservicesrest/v1.0/"

            // const urlOptions = 'Companies/query?search={ "filter":[{"op" : "exist", "field" : "id" }],"IncludeFields": ["Id", "isactive","companyName", "phone"]}'
            const urlOptions = 'Companies/query?search={ "filter":[{"op" : "exist", "field" : "id" }],"IncludeFields": ["Id", "companyName"]}'


            const url = apiBaseURL + urlOptions

            console.log(url)

            var options = {
                headers: {
                    'Content-Type': 'application/json',
                    'ApiIntegrationCode':process.env.AUTOTASK_INTEGRATION_CODE,
                    'UserName':process.env.AUTOTASK_USER,
                    'Secret':process.env.AUTOTASK_SECRET
                }
            }

            axios.get(url, options)
            .then(res=> {
                resolve(res.data.items)
                // console.log("Items:")
                // console.log(res.data.items)
            })
            .catch(err=> {
                resolve(false)
                console.log(err)
            })

        })

    }
    
    static getCompanyOfIdZero() {

        return  new Promise(resolve => {

            const axios = require('axios');

            const url = "https://webservices14.autotask.net/atservicesrest/v1.0/Companies/0/"

            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'ApiIntegrationCode':process.env.AUTOTASK_INTEGRATION_CODE,
                    'UserName':process.env.AUTOTASK_USER,
                    'Secret':process.env.AUTOTASK_SECRET
                }
            }

            axios.get(url, config)
                .then(res=> resolve(res.data.item))
                .catch(err=> {
                    resolve(false)
                    console.log(err)
                })

        })

    }

    static getOpenTicketsMatchingTitle(title) {

        return new Promise(resolve => {

            const axios = require('axios');

            // console.log(id)

            const apiBaseURL = "https://webservices14.autotask.net/atservicesrest/v1.0/"

            // const urlOptions = 'Companies/query?search={ "filter":[{"op" : "exist", "field" : "id" }],"IncludeFields": ["Id", "isactive","companyName", "phone"]}'
            const urlOptions = 'tickets/query?search={"filter":[{"op":"eq","field":"Title","value":"' + title + '"},{"op":"noteq","field":"Status","value":5}]}'


            const url = apiBaseURL + urlOptions

            console.log(url)

            var options = {
                headers: {
                    'Content-Type': 'application/json',
                    'ApiIntegrationCode':process.env.AUTOTASK_INTEGRATION_CODE,
                    'UserName':process.env.AUTOTASK_USER,
                    'Secret':process.env.AUTOTASK_SECRET
                }
            }

            axios.get(url, options)
            .then(res=> {
                resolve(res.data.items)
                // console.log("Items:")
                // console.log(res.data.items)
            })
            .catch(err=> {
                resolve(false)
                console.log(err)
            })

        })

    }

    static async addBillingToTicket(id, note, duration) {

        return new Promise(resolve => {

            const axios = require('axios');

            console.log(id)

            const url = "https://webservices14.autotask.net/atservicesrest/v1.0/TimeEntries"

            var options = {
                headers: {
                    'Content-Type': 'application/json',
                    'ApiIntegrationCode':process.env.AUTOTASK_INTEGRATION_CODE,
                    'UserName':process.env.AUTOTASK_USER,
                    'Secret':process.env.AUTOTASK_SECRET
                }
            }

            // Calculate Timestamps for duration

            const endTimeStamp =  new Date();

            const MS_PER_MINUTE = 60000;
            const durationInMinutes = duration;
            const startTimeStamp = new Date(endTimeStamp - durationInMinutes * MS_PER_MINUTE);
            
            // console.log(formattedDate); 

            const body = {
                "TicketID": id,
                "ResourceID": 29682926,
                "StartDateTime": startTimeStamp,
                "EndDateTime": endTimeStamp,
                "RoleID": 29683461,
                "SummaryNotes": note
            }

            // const body = {
            //     "TicketID": id,
            //     "ResourceID": 29682926,
            //     "StartDateTime": "Jun 14 2024 20:02:39",
            //     "EndDateTime": "Jun 14 2024 20:30:39",
            //     "RoleID": 29683461,
            //     "SummaryNotes": note
            // }

            console.log(body)


            axios.post(url, body, options)
                .then(res=> {
                    console.log(res.data)
                    if(res.data.itemId) {
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

    static test() {
        return true
    }

}

module.exports = AutoTaskAPI