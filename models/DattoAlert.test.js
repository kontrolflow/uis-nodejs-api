require('dotenv').config()

const DattoAlert = require("./DattoAlert")

describe('Datto Alert Model Testing', () => {

    it("Gets all open alerts", async() => {
        // expect(DattoAlert.getAllOpenAlerts()).toEqual(expect.arrayContaining([

        // ]))

        const oldAlerts = await DattoAlert.getAllOpenThirtyDayOldAlerts()
        console.log(oldAlerts[0])

        expect(oldAlerts).toEqual(expect.arrayContaining([
            expect.objectContaining({
                alertUid: expect.any(String),
                // resolveAlert: expect.any(Function)
            })
        ]))
    }, 70000)

    it("Tests Resolving an Alerts of Different Ages", async() => {

        // Beginning of time - Fake ID
        const alert0 = new DattoAlert({alertUid:'alert_uid', timestamp: 0 })
        expect(await alert0.resolveAlertIfOlderThanThirtyDays()).toEqual(expect.objectContaining({
            status: false,
            message: expect.arrayContaining([
                expect.stringContaining("Unable to Resolve Alert (Unknown Error): "),
                expect.stringContaining('Alert Older than 30 Days')
            ])
        }))

        // Jan 1st 2023

        // 30 Days Ago

        // 10 Days Ago

        // Now
        const alertNow = new DattoAlert({alertUid:'alert_uid', timestamp: Date.now() })
        // console.log(alertNow)
        expect(await alertNow.resolveAlertIfOlderThanThirtyDays()).toEqual(expect.objectContaining({
            status: false,
            message: expect.arrayContaining([
                "Timestamp younger than 30 days"
            ])
        }))

        // Fucked up timestamp
        
        // Beginning of time - Fake ID
        const specific = new DattoAlert({alertUid:'ae85d814-7a41-47fb-89e9-e22037f9b0db', timestamp: 0 })
        expect(await specific.resolveAlertIfOlderThanThirtyDays()).toEqual(expect.objectContaining({
            status: true,
            message: expect.arrayContaining([
                expect.stringContaining('Alert Older than 30 Days'),
                expect.stringContaining("Resolved Alert: ")
            ])
        }))
    })

    it("Tests the alert resolver function's ability to ensure a ticket is older than 60 days before resolving", async() => {

        // Alert with now as timestamp
        const nowAlert = {
            timestamp: Date.now()
        }

        expect(await DattoAlert.resolveAlertIfOlderThanSixtyDays(nowAlert)).toEqual(expect.objectContaining({
            message: expect.arrayContaining([
                expect.stringContaining('Alert younger than 60 days'),
            ])
        }))


        // Alert with 1 week old timstamp
        // const weekOldAlert = {
        //     timestamp: Date.now() - 61 * 24 * 60 * 60 * 1000
        // }

        // expect(await DattoAlert.resolveAlertIfOlderThanSixtyDays(weekOldAlert)).toEqual(expect.objectContaining({
        //     message: expect.arrayContaining([
        //         expect.stringContaining('Alert younger than 60 days'),
        //     ])
        // }))

        
        // Alert with 60 Day old timestamp

        // Alert with Jan, 1, 24 as timestamp

        // Alert with Jan, 1, 23 as timestamp
    })

})

describe("Tests the Alert Resolver Function's ablility to ensure a ticket is older than 60 days before resolving", () => {

    // Alert with now as timestamp
    it("Alert from NOW", async() => {
        const alert = {
            timestamp: Date.now()
        }

        expect(await DattoAlert.resolveAlertIfOlderThanSixtyDays(alert)).toEqual(expect.objectContaining({
            message: expect.arrayContaining([
                expect.stringContaining('Alert younger than 60 days'),
            ])
        }))

    })

    // Alert with 1 week old timstamp
    it("Alert from beginning of time", async() => {
        const time = Date.now() - 7 * 24 * 60 * 60 * 1000
        const alert = {
            timestamp: time
        }

        expect(await DattoAlert.resolveAlertIfOlderThanSixtyDays(alert)).toEqual(expect.objectContaining({
            message: expect.arrayContaining([
                expect.stringContaining('Alert younger than 60 days'),
            ])
        }))
    })

    
    // Alert from 59 days ago
    it("Alert from 59 days ago", async() => {
        const time = Date.now() - 59 * 24 * 60 * 60 * 1000
        const alert = {
            timestamp: time
        }

        expect(await DattoAlert.resolveAlertIfOlderThanSixtyDays(alert)).toEqual(expect.objectContaining({
            message: expect.arrayContaining([
                expect.stringContaining('Alert younger than 60 days'),
            ])
        }))
    })

    // Alert from 61 days ago
    it("Alert from 61 days ago", async() => {
        const time = Date.now() - 61 * 24 * 60 * 60 * 1000
        const alert = {
            timestamp: time
        }

        expect(await DattoAlert.resolveAlertIfOlderThanSixtyDays(alert)).toEqual(expect.objectContaining({
            message: expect.arrayContaining([
                expect.stringContaining('Alert older than 60 days'),
            ])
        }))
    })

    // Alert with Jan, 1, 24 as timestamp
    it("Alert from January 1st 2024", async() => {
        const time = 1704085200
        const alert = {
            timestamp: time
        }

        expect(await DattoAlert.resolveAlertIfOlderThanSixtyDays(alert)).toEqual(expect.objectContaining({
            message: expect.arrayContaining([
                expect.stringContaining('Alert older than 60 days'),
            ])
        }))
    })

    // Alert with Jan, 1, 23 as timestamp
    it("Alert from January 1st 2023", async() => {
        const time = 1672549200
        const alert = {
            timestamp: time
        }

        expect(await DattoAlert.resolveAlertIfOlderThanSixtyDays(alert)).toEqual(expect.objectContaining({
            message: expect.arrayContaining([
                expect.stringContaining('Alert older than 60 days'),
            ])
        }))
    })

    // Alert from beginning of time
    it("Alert from beginning of time", async() => {
        const alert = {
            timestamp: 0
        }

        expect(await DattoAlert.resolveAlertIfOlderThanSixtyDays(alert)).toEqual(expect.objectContaining({
            message: expect.arrayContaining([
                expect.stringContaining('Alert older than 60 days'),
            ])
        }))
    })


})