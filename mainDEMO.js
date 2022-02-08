// npm init
// npm install pdf-lib
// npm install xlsx
// npm install nodemailer
// node mainDEMO.js

// npm install express 
// instead of main.js uploading mainDemo.js difference is Credentials
//
// you have to enter your credentials..

let pdf = require("pdf-lib");
let xlsx = require("xlsx");
let fs = require("fs");
let nodemailer = require("nodemailer");


// const { redis } = require("googleapis/build/src/apis/redis");


// const { google } = require('googleapis');





//const CLIENT_ID = 'yourClientID';
//const CLIENT_SECRET = 'yourClientSecret';
//const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
//const REFRESH_TOKEN = 'yourRefreshToken';

//const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET, REDIRECT_URI);
//oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// READING EXCEL DATA GATHER VIA GOOGLE FORM
let dataXlsx = xlsx.readFile("data.xlsx");
let dataSheet = dataXlsx.Sheets['Form Responses 4']; 
let data = xlsx.utils.sheet_to_json(dataSheet);

// READING DATE, SUBJECT AND CONTENT FOR CERTIFICATE
let date = "27 April 2022";
let subject = fs.readFileSync('subject.txt', 'utf-8');
let body = fs.readFileSync('body.txt', 'utf-8');    


for(let i = 0; i< data.length; i++){
    let name = data[i].Name;
    // CREATING & STORING CERTIFICATE
    createCertificate(name, date);
    console.log(" cirtificate generated");
    // setTimeout(() => {console.log('10 second finished!')}, 10000);

    let certiPath = "Certificates/"+ name + ".pdf";
    // READING EMAIL FROM JSON FOR ith USER
    let userEmail = data[i].Email;

 // CALLING FUNCTION PROMISE FOR SENDING MAIL
   sendMail(subject,body, name, userEmail, certiPath).then(function(result){
       console.log("Email is sent", result);
       
   }).catch(function(err){
       console.log(err);
   }
    )
    
       // setTimeout(() => {console.log('20 second finished!')}, 20000);
}

// FUNCTION FOR CREATING CERTIFICATE
function createCertificate(name, date) {
    
    let pdfBytes = fs.readFileSync("template.pdf");
    let pdfPromise = pdf.PDFDocument.load(pdfBytes);
    pdfPromise.then(function(pdfdoc){
        let page = pdfdoc.getPage(0);
        page.drawText(name,{
            x: 72,
            y: 275,
            size: 55,
            
      
            
    
        });
        page.drawText(date,{
            x: 70,
            y: 205,
            size: 16 
        });

        let finalPdf = pdfdoc.save();
        let pdfName = "Certificates/"+name + ".pdf";
        finalPdf.then(function(finalBytes){
            fs.writeFileSync(pdfName,finalBytes);
        })
    })
}

// FUNCTION FOR SENDING EMAIL
async function sendMail(subject, body, name, userEmail, certiPath) {
    try {
        // let accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'hotmail',
   
            auth: {
                // type: 'OAuth2',
                user: 'satyam-0@outlook.com',
                pass: 'password of your outlook id',
                // clientId: CLIENT_ID,
                //clientSecret: CLIENT_SECRET,
                //refreshToken: REFRESH_TOKEN,
                //accessToken : accessToken
                connectionTimeout: 4 * 60 * 1000, // 4 min
            }
        })
        let mailOptions = {
            from: 'satyam-0@outlook.com',
            to: userEmail,
            subject: subject,
            html: "Dear " + name + "\n" + body,
            attachments: [{
                filename: name + ".pdf",
                path: certiPath,
                contentType: 'application/pdf'
            }]
        }
        let result = await transport.sendMail(mailOptions);
        return result;
    } catch (err) {
        console.log(err);
        return err;
    }
}
