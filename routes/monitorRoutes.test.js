const request = require('supertest');
const app = require('../index.js')

describe('Tests the Monitoring Routes', () => {

    it("Datto Token Validation", async () => {
        const res = await request(app)
            .get('/monitor/datto-token-validation')
        expect(res.statusCode).toEqual(200)
    })

}) 