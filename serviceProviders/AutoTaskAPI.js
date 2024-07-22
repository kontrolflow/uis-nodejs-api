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

    static test() {
        return true
    }

}

module.exports = AutoTaskAPI