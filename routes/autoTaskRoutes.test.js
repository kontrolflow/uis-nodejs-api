const request = require('supertest');
const app = require('../index.js')

describe('Tests the Company Not Found Webook', () => {

    it("No ticket id provided", () => {
        return request(app)
            .get('/autotask/company-not-found')
            // .expect('Content-Type', /json/)
            // .expect('Content-Length', '15')
            .expect(200)
            // .end(function(err, res) {
            //     if (err) throw err;
            // });
    })

    it("Nonexistent ticket id provided", () => {

    })

}) 