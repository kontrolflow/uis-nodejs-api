class DattoAPI {

    static baseApiUrl = 'https://concord-api.centrastage.net/api/v2'

    static get(endpoint) {
        return  new Promise(resolve => {

            const axios = require('axios');

            // console.log(id)

            const url = DattoAPI.baseApiUrl + endpoint
            console.log(url)

            var config = {
                headers: {
                    'Authorization': process.env.DATTO_API_KEY
                }
            }

            axios.get(url, config)
                .then(res=> resolve(res.data))
                .catch(err=> {
                    resolve(false)
                    console.log(err)
                })

        })
    }

    static post(endpoint, body) {
        return  new Promise(resolve => {

            const axios = require('axios');

            // console.log(id)

            const url = DattoAPI.baseApiUrl + endpoint
            console.log(url)

            var config = {
                headers: {
                    'Authorization': process.env.DATTO_API_KEY
                }
            }

            axios.post(url, body, config)
                .then(res=> resolve(res))
                .catch(err=> {
                    console.log(err)
                    resolve({status:false, error: err})
                })

        })
    }

    static getWithFullURL(endpoint) {
        return  new Promise(resolve => {

            const axios = require('axios');

            const url = endpoint
            console.log(url)

            var config = {
                headers: {
                    'Authorization': process.env.DATTO_API_KEY
                }
            }

            axios.get(url, config)
                .then(res=> resolve(res.data))
                .catch(err=> {
                    resolve(false)
                    console.log(err)
                })

        })
    }

    static getAlertById(id) {

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

    static test() {

        return  new Promise(resolve => {

            const axios = require('axios');

            // console.log(id)

            const url = "https://concord-api.centrastage.net/api/v2/account"

            var config = {
                headers: {
                    'Authorization': process.env.DATTO_API_KEY
                }
            }

            axios.get(url, config)
                .then(res=> resolve(res.data))
                .catch(err=> {
                    resolve(false)
                    console.log(err)
                })

        })

    }

}

module.exports = DattoAPI