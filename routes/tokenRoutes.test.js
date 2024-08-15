const request = require('supertest');
const app = require('../index.js')

describe('Test the updating of the Datto API Token', () => {

    // No API Access Token Provided
    it("No Token Provided", async () => {
        const res = await request(app)
            .patch('/tokens/datto')
        expect(res.statusCode).toEqual(401)
    })

    // Incorrect Token Provided
    it("Incorrect Token Provided", async () => {
        const res = await request(app)
            .patch('/tokens/datto')
            .set('Authorization', `Bearer asdfasdfasdf`)
        expect(res.statusCode).toEqual(401)
    })

    // Token Provided but no updated Datto API Token provided
    it("Authenticated but no token provided", async () => {
        const res = await request(app)
            .patch('/tokens/datto')
            .set('Authorization', `Bearer ` + process.env.POWER_AUTOMATE_API_TOKEN)
        expect(res.statusCode).toEqual(400)
    })

    // Authenticated but invalid Datto API token Provided
    it("Incorrect Token Provided", async () => {
        const res = await request(app)
            .patch('/tokens/datto')
            .send({
                newDattoApiToken: "invalideTokenString"
            })
            .set('Authorization', `Bearer ` + process.env.POWER_AUTOMATE_API_TOKEN)
        expect(res.statusCode).toEqual(400)
    })

    it("Authenticated and valid Datto API Token Provided", async () => {
        const validDattoApiToken = process.env.DATTO_API_KEY.replace("Bearer ", "")
        const res = await request(app)
            .patch('/tokens/datto')
            .send({
                newDattoApiToken: validDattoApiToken
            })
            .set('Authorization', `Bearer ` + process.env.POWER_AUTOMATE_API_TOKEN)
        expect(res.statusCode).toEqual(200)
    })

}) 