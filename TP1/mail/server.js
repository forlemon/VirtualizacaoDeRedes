// server.js

// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var request = require('request');

// configuration =================
var sendmail = require('sendmail')({
    logger: {
        debug: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    },
    silent: false,
    /*dkim: { // Default: False
        privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
        keySelector: 'mydomainkey'
    },*/
    smtpPort: 25, // Default: 25
    smtpHost: 'smtp' // Default: -1 - extra smtp host after resolveMX
});

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
            if (data.message === "Success") {
                var email = data.email;
                sendmail({
                    from: 'no-reply@vrg3.gcom.di.uminho.pt',
                    to: 'nunocv96@gmail.com',
                    subject: 'test sendmail',
                    html: 'Mail of test sendmail ',
                }, function (err, reply) {
                    console.log(err && err.stack);
                    console.dir(reply);
                });
                console.log("EMAIL SENT");
            }
        }       
    });

});
