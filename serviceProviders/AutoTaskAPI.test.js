require('dotenv').config()

const AutoTaskAPI = require("./AutoTaskAPI")

describe('AutoTask API', () => {

    it("Gets Ticket Details", async() => {
        expect(await AutoTaskAPI.getTicketDetails(37410)).toEqual(
            expect.objectContaining({
                id: expect.any(Number)
            })
        )
    })

    it("Does a Quick Test", async() => {
        expect(AutoTaskAPI.test()).toEqual(true)
    })

    it("Retrieves all Clients", async() => {
        expect(await AutoTaskAPI.getAllClients()).toEqual(
            // expect.arrayContaining([
            //     expect.
            // ])
        )
    })

})