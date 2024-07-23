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

    autoFindCompany() {
        return new Promise(async resolve => {
        // Get All Companies
        const companies = await AutoTaskAPI.getAllClients()

        console.log(this)

        if(this.title.includes('PAF Approval')){
            console.log("PAF Approval Ticket")
            const fields = {
                companyID: 220,
                contactID: null,
                companyLocationID: null,
                priority: 1
            }
            this.update(fields)
            resolve(true)

        } else if(this.title.includes('Control Panel Daily Report')){
            console.log("Control Panel Daily Report Ticket")
            const fields = {
                companyID: 0,
                contactID: null,
                companyLocationID: null,
            }
            this.update(fields)
            resolve(true)

        } else if(this.title.includes('SCJX')){
            console.log("Ticket for Schultz Center")
            const fields = {
                companyID: 215,
                contactID: null,
                companyLocationID: null,
            }
            this.update(fields)
            resolve(true)

        } else if(this.title.includes('FCOSM')){
            console.log("Ticket for Florida Center of Sleep Medicine")
            const fields = {
                companyID: 199,
                contactID: null,
                companyLocationID: null,
            }
            this.update(fields)
            resolve(true)

        } else {

            // Find Company By Title
            const companyID = await this.constructor.matchCompanyToString(this.title, companies)

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
            }

        }

        })
    }

    static matchCompanyToString(string, companies) {
        return new Promise(resolve => {
            const lc = string.toLowerCase()
            console.log(lc)
            let guess = false

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