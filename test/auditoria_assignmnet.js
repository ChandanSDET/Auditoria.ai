const fs = require('fs')
const nodemailer = require('nodemailer');

class AuditoriaAssignmnent {
    read_and_write_file() {
        const fileContents = fs.readFileSync(__dirname + '/SampleFile.rtf').toString();
        const contentArray = fileContents.split('\n');

        fs.truncate(__dirname + '/SampleFile.rtf', 0, function () { });

        var logger = fs.createWriteStream(__dirname + '/SampleFile.rtf', {
            flags: 'a'
        });

        for (let idx = 0; idx < contentArray.length; idx++) {
            if (contentArray[idx].includes('Tax Identification:')) {
                logger.write(contentArray[idx]
                    .replace(contentArray[idx]
                        .substring(contentArray[idx]
                            .lastIndexOf(':')), ': 222-33-4444'));
                logger.write('\n');
            } else if (contentArray[idx].includes('Type of Tax Identification Number:')) {
                logger.write(contentArray[idx]
                    .replace(contentArray[idx]
                        .substring(contentArray[idx]
                            .lastIndexOf(':')), ': ITIN'));
                logger.write('\n');
            }
            else {
                logger.write(contentArray[idx]);
            }
        }

    }

    trigger_email() {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'omshiva.chandan@gmail.com',  // Here You have to change your email
                pass: '**********'  // Please pass the password for above email
            }
        });

        const mailOptions = {
            from: 'omshiva.chandan@gmail.com', // / Here You have to use the above email enteded by you.
            to: 'kumar.chandanmandal@gmail.com, omshiva.chandan@gmail.com',  // Here you have to pass recipients email ids
            subject: 'Please find the attachment!',
            html: '<h5>Hi Sir,</h5><p>Pease find the attached file below!</p>',
            attachments: [
                {
                    filename: 'SampleFile.rtf',
                    path: __dirname + '/SampleFile.rtf'
                }]
        };

        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log('Unable to send mail, please check your email address and password.');
            } else {
                console.log('Email send successfully ' + data.response);
            }
        });
    }

}

const app = new AuditoriaAssignmnent();
app.read_and_write_file();
app.trigger_email();