require('dotenv').config()

const AutoTaskTicket = require("./AutoTaskTicket")
const AutoTaskAPI = require('../serviceProviders/AutoTaskAPI')

describe('AutoTask Ticket', () => {

    // Get Ticket ID
    const id = 45562
 
    // Instantiate Ticket
    const AutoTaskTicket = require('../models/AutoTaskTicket')
    const ticket = new AutoTaskTicket(id)
    
    it("Finds the Company for String that Matches Ivantsov.tech", async() => {
        const string1 = "Title: Ivantsov.tech random stuff"
        const companies = await AutoTaskAPI.getAllClients()
        // console.log(companies)
        expect(await AutoTaskTicket.matchCompanyToString(string1, companies)).toEqual(251)
    })

    it("Finds the Company for String that Matches Vicar's Landing", async() => {
        const string1 = "Title: Vicars Landing random stuff"
        const companies = await AutoTaskAPI.getAllClients()
        // console.log(companies)
        expect(await AutoTaskTicket.matchCompanyToString(string1, companies)).toEqual(220)
    })

    it("Finds the Company for String that Matches Vicar's Landing", async() => {
        const string1 = "Title: Vicars + Something"
        const companies = await AutoTaskAPI.getAllClients()
        // console.log(companies)
        expect(await AutoTaskTicket.matchCompanyToString(string1, companies)).toEqual(220)
    })
    
})