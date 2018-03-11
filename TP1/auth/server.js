// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var randToken = require('rand-token');
    // configuration =================

    mongoose.connect('mongodb://database:27017');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

    // listen (start app with node server.js) ======================================
    app.listen(8081);
    console.log("App listening on port 8080");

    var token = mongoose.model('User', {
        user : String,
        pass: String,
        token: String
    });

    app.get("/", function(req,res){
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })

    app.post("/token", function(req,res){
        var username = req.body.user;
        var password = req.body.pass;
        token.find({
            user: username
        },
        'pass token',
        function(err, token){
            if(err){
                //Gerar token e inserir na DB
            }
            else{
                if(token.pass == password)
                    res.send(token.token);
            }
        }
        );
    })

    app.post("/mail/validate", function(req, res){

    })
    