class Email {

    static send(to, subject, text) {

        return new Promise(resolve => {
            const nodemailer = require('nodemailer');

            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        
            let mailDetails = {
                from: 'jullianabinsay@gmail.com',
                to: to,
                subject: subject,
                text: text
            };
            
            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })

    }
}
module.exports = Email