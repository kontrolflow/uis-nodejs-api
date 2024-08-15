require('dotenv').config()
const DattoAPI = require("./DattoAPI")

// Testing for the DattoAPI

describe('Datto API', () => {

    it("Tests a GET request for account info", async() => {
        expect(await DattoAPI.get("/account")).toEqual(expect.objectContaining({
            id: 5961
        }))
    })

    it("Tests the get() function", async() => {

        const alertUid = "f004f142-3367-4677-b126-fb8372e1ed60"

        expect(await DattoAPI.get('/alert/' + alertUid)).toEqual(expect.objectContaining({
            alertUid: alertUid
        }))
    })

    it("Tests the getWithFullURL() function", async() => {

        const url = "https://concord-api.centrastage.net/api/v2/account/alerts/open?max=250&page=1"

        expect(await DattoAPI.getWithFullURL(url)).toEqual(expect.objectContaining({
            pageDetails: expect.any(Object),
            alerts: expect.any(Array)
        }))
    })

})

describe('Tests the the Token Validator', () => {

    it("Using the Datto Token from the DOTENV file", async() => {
        expect(await DattoAPI.validateToken(process.env.DATTO_API_KEY)).toEqual(true)
    })

    it("Using an old Datto Token", async() => {
        const oldToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYWVtLWFwaSJdLCJ1c2VyX25hbWUiOiJVSVMtQVBJIiwic2NvcGUiOlsiZGVmYXVsdCJdLCJjbGllbnRBdXRob3JpdGllcyI6W10sImFjY291bnRfdWlkIjoiY29uZjJhNjAwMDEiLCJleHAiOjE3MjMzNDYxMDUsImlhdCI6MTcyMjk4NjEwNSwiYXV0aG9yaXRpZXMiOlsiQVVUT1RBU0tfQUVNX1VTRVIiXSwianRpIjoiNUtMTGhWbWl1SXZXRTdTZWhUbEdTMTVXUjlRIiwiY2xpZW50X2lkIjoicHVibGljLWNsaWVudCJ9.KOKBeAwg0a-RqTlqTlpoSnV9_6x0MCQlHDpv0_P_wQ1ZGej6HwqMrYQMK-ZqOhi2SKh0ayfHaCa2hmxD8BplljFhlfpy8OQZJbk7E0c_ad5jsMtSXrrH-nwvVqPj1JXnNiUEjtV9hVFHTknhiiqMrdvelgJfut1abLRq4o-w8FlIZ9a82dfY6e16Jye-UXMXAbZT0N49kx2jYXuv_fdYwlk6Ujka3T7COtI8NbpbIBBWttmWURZKv8KxpSMwsmxtvRNhjU61x8E8D1cekWrYOQZkWYqAUXvNHWRR0jZbCDZ9yRmTsBc1erd1YO84KPSJzuyQyGDU8mSaClZSaZCEHQ"
        expect(await DattoAPI.validateToken("Bearer " + oldToken)).toEqual(false)
    })

    it("Using an invalid token", async() => {
        expect(await DattoAPI.validateToken("Bearer asdfasdfasdfas")).toEqual(false)
    })



})