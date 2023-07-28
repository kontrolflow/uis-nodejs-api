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

})