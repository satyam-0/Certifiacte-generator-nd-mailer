

 const nodemailer = require('nodemailer');
 let mailTransporter = nodemailer.createTransport({
     service: 'hotmail',
     auth: {
         user: 'satyam-0@outlook.com',
         pass: 'Enter your password '
     }
 });
 let mailDetails = {
     from: 'satyam-0@outlook.com',
     to: 'satyammodanwal2000@gmail.com',
     subject: 'Test mail',
     text: 'Node.js testing mail for GeeksforGeeks'
 };
mailTransporter.sendMail(mailDetails, function (err, data){
    if (err) {
        console.log('Error Occurs');
    } else {
        console.log('Email sent successfully');
    }
} )

