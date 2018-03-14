// server.js

// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var nodemailer = require('nodemailer');     // send mails
var request = require('request');
// configuration =================


app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// listen (start app with node server.js) ======================================
app.listen(8082);
console.log("App listening on port 8082");

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.post("/mail", function (req, res) {

    var data = {};
    var ttoken = req.body.token;
    var verifyTokenRequest = {
        url: "http://auth:8081/mail/validate",
        method: "POST",
        form: { token: ttoken }
    }
    request(verifyTokenRequest, function (err, res2, body) {
        if (err) {
            res.send(err);
        }
        else {
            var data = JSON.parse(body);
            res.send(data.message);

            var email = data.email;
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 25,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "vr.g3.uminho@gmail.com", // generated ethereal user
                        pass: "grupo3virt" // generated ethereal password
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"Grupo3 Virtualizacao de Redes" <grupo3@vrg3.gcom.di.uminho.pt>', // sender address
                    to: email, // list of receivers
                    subject: 'Hello ✔', // Subject line
                    text: 'Hello world?', // plain text body
                    html: '<b>Hello world?</b>' // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            });
        }
    });

});
