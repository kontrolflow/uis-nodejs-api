// Imports for API Routing
const express = require('express');
const router = express.Router();

// Database Import
// const DB = require("../serviceProviders/DB")

router.get('/version', async (req, res) => {
    let version = 2.3
    console.log("Version: " + version)
    res.send("Version: " + version)
})

router.get('/send-email', async (req, res) => {

    console.log("Sending Test Email")

    const Email = require('../serviceProviders/Email')

    Email.send('jullian@abinsay.com', 'Test Email from UIS-NodeJS-API', '9043219777')

    res.status(200).send("Email sent successfully")

})

router.get('/create-test-tickets', async (req, res) => {

    console.log("Creating Test Tickets")

    const Email = require('../serviceProviders/Email')

    // Email.send('support@umbrellaitgroup.com', 'Testing - Control Panel Daily Report', '9043219777')

    // Email.send('support@umbrellaitgroup.com', 'Testing - PAF Approval', '9043219777')

    Email.send('support@umbrellaitgroup.com', 'Testing - SCJX', '9043219777')

    Email.send('support@umbrellaitgroup.com', 'Testing - Alert for SCJX', '9043219777')

    Email.send('support@umbrellaitgroup.com', 'Testing - FCOSM', '9043219777')

    Email.send('support@umbrellaitgroup.com', 'Testing - Alert for FCOSM', '9043219777')

    // Email.send('support@umbrellaitgroup.com', 'Testing - Ivantsov.tech', '9043219777')

    // Email.send('support@umbrellaitgroup.com', 'Testing - Lindell & Farson, PA', '9043219777')

    // Email.send('support@umbrellaitgroup.com', 'Testing - Vicars Landing', '9043219777')

    // Email.send('support@umbrellaitgroup.com', 'Testing - Vicars + Somthing Else', '9043219777')

    // Email.send('support@umbrellaitgroup.com', 'Testing - InDepth Environmental Inc.', '9043219777')

    // Email.send('support@umbrellaitgroup.com', 'Voicemail', 'Testing 123...')

    // Email.send('support@umbrellaitgroup.com', 'Meraki - Please Ignore', 'Testing 123...')    

    
    // if(await Email.send('support@umbrellaitgroup.com', 'Testing - Please Ignore', 'Testing 123...') == true) {
    //     console.log('Email sent successfully');
        res.status(200).send("Email sent successfully")
    // } else {
    //     console.log('Error Occurs')
    //     res.status(200).send("Error Occurs")
    // }
    // https://ww14.autotask.net/Autotask/AutotaskExtend/ExecuteCommand.aspx?Code=OpenTicketDetail&TicketID=37708

})

router.get('/get-ticket', async (req, res) => {
    
    console.log('/get-ticket (Route)')

    const AutoTaskTicket = require('../models/AutoTaskTicket')

    const ticket = new AutoTaskTicket(40861)
    
    if(await ticket.init()) {
        console.log(ticket)
        res.send(ticket)
    }

})

router.get('/update-ticket', async (req, res) => {
    
    console.log('/update-ticket (Route)')

    const AutoTaskTicket = require('../models/AutoTaskTicket')

    const ticket = new AutoTaskTicket(37711)

    const updates = {
        description: "Updated Again",
        title: "Test - Don't Delete Me - Updated Again"
    }

    if(await ticket.update(updates)) {
        console.log("Ticket Updated Successfully")
        console.log(ticket)
    }

})
    
router.get('/get-ticket-2', async (req, res) => {

    // https://ww14.autotask.net/Autotask/AutotaskExtend/ExecuteCommand.aspx?Code=OpenTicketDetail&TicketID=37258
    // https://ww14.autotask.net/Autotask/AutotaskExtend/ExecuteCommand.aspx?Code=OpenTicketDetail&TicketID=37679


    const {AutotaskRestApi} = require('@apigrate/autotask-restapi');

    const autotask = await new AutotaskRestApi(
        process.env.AUTOTASK_USER, // make sure it's an API User
        process.env.AUTOTASK_SECRET, 
        process.env.AUTOTASK_INTEGRATION_CODE 
    );

    let api = await autotask.api();
    let ticket = await api.Tickets.get(37679);//Get the root company
    console.log(ticket)
})

router.get('/db-connection', async (req, res) => {

    // console.log(Mongo)

    const db = new DB()

    const result = await db.query().collection("Users").find({}).toArray()
    
    if (result) {
        // console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log("No Result");
    }
    
    db.close()

    res.send("MongoDB")

})

router.get('/parse', async (req, res) => {

    function parseBackupReport(jsonData) {
        const description = jsonData.item.description;
        const title = jsonData.item.title;
        const lines = description.split('\n');
        
        const result = {
          reportInfo: {
            title: title,
            date: '',
            timezone: '',
            detailedReportLink: ''
          },
          customers: {},
          summary: {
            totalIssues: 0,
            issuesByCustomer: {}
          }
        };
      
        let currentCustomer = null;
        let totalIssuesFromTitle = 0;
      
        if (title.includes("Issues")) {
          totalIssuesFromTitle = parseInt(title.split(":")[1].trim().split(" ")[0]);
        }
      
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          
          if (line.match(/^\w{3}, \d{2} \w{3} \d{4}/)) {
            result.reportInfo.date = line;
          } else if (line.startsWith('(UTC')) {
            result.reportInfo.timezone = line;
          } else if (line.startsWith('Click here')) {
            result.reportInfo.detailedReportLink = line;
          } else if (line && !line.includes('Virtual Machines') && !line.includes('VMs') && !line.includes('Status')) {
            // Check if the next line contains "Virtual Machines" to confirm it's a customer name
            if (i + 1 < lines.length && lines[i + 1].includes('Virtual Machines')) {
              currentCustomer = line;
              result.customers[currentCustomer] = {
                totalVMs: 0,
                backups: { successful: 0, status: '' },
                offsiteCopies: { successful: 0, status: '' },
                verification: { successful: 0, status: '' },
                replication: { successful: 0, status: '' },
                issues: 0
              };
            }
          } else if (currentCustomer && line.includes('Total of')) {
            const totalVMs = parseInt(line.match(/Total of (\d+) VMs/)[1]);
            result.customers[currentCustomer].totalVMs = totalVMs;
          } else if (currentCustomer && line.startsWith('VMs')) {
            const parts = line.split(/\s+/).filter(part => part.trim() !== '');
            if (parts.length >= 5) {
              result.customers[currentCustomer].backups.successful = parseInt(parts[1]);
              result.customers[currentCustomer].backups.status = parts[2];
              result.customers[currentCustomer].offsiteCopies.successful = parseInt(parts[3]);
              result.customers[currentCustomer].offsiteCopies.status = parts[4];
            }
          } else if (currentCustomer && line.startsWith('Status')) {
            const parts = line.split(/\s+/).filter(part => part.trim() !== '');
            if (parts.length >= 3) {
              result.customers[currentCustomer].verification.status = parts[1];
              result.customers[currentCustomer].replication.status = parts[2];
            }
          } else if (currentCustomer && line.toLowerCase().includes('issues detected')) {
            const issuesDetected = parseInt(line.match(/(\d+)/)[1]);
            result.customers[currentCustomer].issues = issuesDetected;
            result.summary.totalIssues += issuesDetected;
            result.summary.issuesByCustomer[currentCustomer] = {
              totalIssues: issuesDetected
            };
          }
        }
      
        // Validate total issues with the title
        if (totalIssuesFromTitle > 0 && totalIssuesFromTitle !== result.summary.totalIssues) {
          console.warn(`Warning: Total issues in title (${totalIssuesFromTitle}) does not match calculated total (${result.summary.totalIssues})`);
        }
      
        return result;
      }
      
      // Example usage:
      const inputJson = {
        item: {
            title: "Control Panel Daily Report: 5 Issues",
            description: "From Hornetsecurity <noreply@cloud.hornetsecurity.com>: Control Panel Daily Report\r\n\r\n \t Thu, 18 Jul 2024 07:30 - Fri, 19 Jul 2024 07:29\r\n\r\n \t (UTC-05:00) Eastern Time (US & Canada)\r\n\r\n \t Click here to view detailed report in the Control Panel\r\n\r\n \t Workplace Solutions Inc\r\n\r\n Virtual Machines (Total of 7 VMs) Virtual Machines (Total of 7 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 5 issues detected\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t Acon\r\n\r\n Virtual Machines (Total of 2 VMs) Virtual Machines (Total of 2 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 2\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t Florida Centers of Sleep Medicine\r\n\r\n Virtual Machines (Total of 11 VMs) Virtual Machines (Total of 11 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 8\r\n\r\n \t Successful\r\n\r\n \t 4\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t Jacksonville Endodontic Associates\r\n\r\n Virtual Machines (Total of 3 VMs) Virtual Machines (Total of 3 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 2\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t Lindell & Farson\r\n\r\n Virtual Machines (Total of 5 VMs) Virtual Machines (Total of 5 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 4\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t National Carburetor\r\n\r\n Virtual Machines (Total of 3 VMs) Virtual Machines (Total of 3 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 3\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t Peter Sleiman Development Group\r\n\r\n Virtual Machines (Total of 3 VMs) Virtual Machines (Total of 3 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 2\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t Schultz Center\r\n\r\n Virtual Machines (Total of 7 VMs) Virtual Machines (Total of 7 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 6\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t Ticon\r\n\r\n Virtual Machines (Total of 2 VMs) Virtual Machines (Total of 2 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 2\r\n\r\n \t Successful\r\n\r\n \t 2\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t Umbrella IT Group\r\n\r\n Virtual Machines (Total of 13 VMs) Virtual Machines (Total of 13 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 9\r\n\r\n \t Successful\r\n\r\n \t 7\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t Vicars Landing\r\n\r\n Virtual Machines (Total of 28 VMs) Virtual Machines (Total of 28 VMs) Backups Offsite Copies Verification Replication\r\n\r\n \t VMs\r\n\r\n \t Status\r\n\r\n \t 15\r\n\r\n \t Successful\r\n\r\n \t 3\r\n\r\n \t Successful\r\n\r\n \t 0\r\n\r\n \t Successful\r\n\r\n \t 2\r\n\r\n \t Successful\r\n\r\n Please do not reply to this email. If you need to contact Hornetsecurity\r\n with questions or concerns, please click here."
        }
      };
      
      const parsedResult = parseBackupReport(inputJson);
      console.log(JSON.stringify(parsedResult, null, 2));

    res.send(JSON.stringify(parsedResult, null, 2))

})

module.exports = router