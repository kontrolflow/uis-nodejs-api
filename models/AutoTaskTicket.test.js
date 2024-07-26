require('dotenv').config()

// const AutoTaskTicket = require("./AutoTaskTicket")
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

describe('Ticket Client Finder via JSON Mappings', () => {

    const AutoTaskTicket = require('../models/AutoTaskTicket')
    
    it("Finds the Company for String that Matches PAF Approval", async() => {
        const ticket = new AutoTaskTicket()
        ticket.title = "PAF Approval"
        expect(await AutoTaskTicket.matchCompanyUsingMappings(ticket)).toEqual(expect.objectContaining({
            companyID:220
        }))
    })

    it("Finds the Company for String that Matches Control Panel Daily Report", async() => {
        const ticket = new AutoTaskTicket()
        ticket.title = "Control Panel Daily Report"
        expect(await AutoTaskTicket.matchCompanyUsingMappings(ticket)).toEqual(expect.objectContaining({
            companyID:0
        }))
    })

    it("Finds the Company for String that Matches FCOSM", async() => {
        const ticket = new AutoTaskTicket()
        ticket.title = "FCOSM"
        expect(await AutoTaskTicket.matchCompanyUsingMappings(ticket)).toEqual(expect.objectContaining({
            companyID:199
        }))
    })

    it("Finds the Company for String that doesn't have matches", async() => {
        const ticket = new AutoTaskTicket()
        ticket.title = "Unmatching Title"
        expect(await AutoTaskTicket.matchCompanyUsingMappings(ticket)).toEqual(false)
    })
    
})