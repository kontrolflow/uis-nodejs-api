// Model: AutoTask Ticket

const AutoTaskAPI = require('../serviceProviders/AutoTaskAPI')

class AutoTaskTicket {

    constructor(id) {
        this.id = id
    }

    init() {
        return new Promise(async resolve => {

            console.log("Contruction Auto Task Ticket")

            // Get Ticket Info
            const ticketDetails = await AutoTaskAPI.getTicketDetails(this.id)

            console.log(ticketDetails)

            // Set Object Data
            this.title = ticketDetails.title
            this.description = ticketDetails.description
            this.companyID = ticketDetails.companyID

            this.ticketNumber = ticketDetails.ticketNumber

            resolve(true)

        })

    }

    update(fields) {

        return AutoTaskAPI.updateTicket(this.id, fields)
        
    }

    static matchCompanyUsingMappings(ticket) {
        const mappings = require('../CompanyNotFoundMappings.json')
        let fields = false
        mappings.forEach((matchSet) => {
            matchSet.matches.forEach((match) => {
                if(ticket.title.includes(match)) {
                    fields = matchSet.fields
                }
            })
            console.log(matchSet)
        })
        console.log(mappings)
        console.log(ticket)
        return fields
    }

    autoFindCompany() {
        return new Promise(async resolve => {

            // Get All Companies
            const companies = await AutoTaskAPI.getAllClients()

            console.log(this)

            // Check if title matches anything in the JSON Mapping Object
            const fields = await this.constructor.matchCompanyUsingMappings(this)
            if(fields){

                // The title matched / Update the ticket with the configured fields
                this.update(fields)

            // Check if ticket is an Altero Backup report
            } else if(this.title.includes("Control Panel Daily Report")) {

                console.log("It's a backup report!!!")
            
            // Check if Ticket Title matches a company
            } else {
                

                // Find Company By Title
                const companyID = await this.constructor.matchCompanyToString(this.title, companies)
                console.log(companyID)

                // If Company Found Try to Update Else Return False
                if(companyID >= 0) {
                    const fields = {
                        companyID: companyID,
                        companyLocationID: null
                    }
                    
                    this.update(fields)
                    resolve(true)
                } else {
                    resolve(false)
                    console.log("Could not find company")
                }

            }

        })
    }

    static matchCompanyToString(string, companies) {
        return new Promise(resolve => {
            const lc = string.toLowerCase()
            console.log(lc)
            let guess = -1

            // console.log(companies)
            if(lc.includes("vicars")) {
                guess = 220
            } else {
                companies.forEach(company => {
                    const lcCompany = company.companyName.toLowerCase()
                    // console.log(lc)
                    // console.log(lcCompany)
                    if(lc.includes(lcCompany)) {
                        guess = company.id
                        console.log(company)
                    }
                });
            }

            resolve(guess)
        })
    }

}

module.exports = AutoTaskTicket