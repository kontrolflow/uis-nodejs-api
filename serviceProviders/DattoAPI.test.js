require('dotenv').config()
const Datto = require("./DattoAPI")

// Testing for the DattoAPI

describe('Datto API', () => {

    it("Tests a GET request for account info", async() => {
        expect(await Datto.get("/account")).toEqual(expect.objectContaining({
            id: 5961
        }))
    })

    it("Tests the get() function", async() => {

        const alertUid = "f004f142-3367-4677-b126-fb8372e1ed60"

        expect(await Datto.get('/alert/' + alertUid)).toEqual(expect.objectContaining({
            alertUid: alertUid
        }))
    })

    it("Tests the getWithFullURL() function", async() => {

        const url = "https://concord-api.centrastage.net/api/v2/account/alerts/open?max=250&page=1"

        expect(await Datto.getWithFullURL(url)).toEqual(expect.objectContaining({
            pageDetails: expect.any(Object),
            alerts: expect.any(Array)
        }))
    })

    // it("Tests the post() function", async() => {

    //     const endpoint = "/alert/db73ea19-7dbc-4bc2-a72d-991582ba5645/resolve"

    //     expect(await Datto.post(endpoint, {})).toEqual('')
    // })





    // it("Gets Ticket Details", async() => {
    //     expect(await AutoTaskAPI.getTicketDetails(37410)).toEqual(
    //         expect.objectContaining({
    //             id: expect.any(Number)
    //         })
    //     )
    // })

    // it("Does a Quick Test", async() => {
    //     expect(await Datto.test()).toEqual(true)
    // })

    // it("Retrieves all Clients", async() => {
    //     expect(await AutoTaskAPI.getAllClients()).toEqual(
    //         expect.arrayContaining([
    //             expect.objectContaining({
    //                 id: expect.any(Number)
    //             })
    //         ])
    //     )
    // })

})