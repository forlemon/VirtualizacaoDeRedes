// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var randToken = require('rand-token');
    // configuration =================

    mongoose.connect('mongodb://localhost:27017');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

    // listen (start app with node server.js) ======================================
    app.listen(8081);
    console.log("App listening on port 8081");

    var Token = mongoose.model('Token', {
        user: String,
        pass: String,
        token: String
    });

    app.get("/", function(req,res){
        res.sendFile(path.join(__dirname + '/public/index.html'));
    })

    app.post("/token", function(req,res){
        var username = req.body.user;
        var password = req.body.pass;
        Token.find({
            user: username
        },
        'pass token',
        function(err, result){
            if(result.length != 0){
                if(result[0].pass === password)
                    res.send(result[0].token);
                else{
                    res.send("Wrong password")
                }
                console.log(result);
            }
            else{
                //Gerar token e inserir na DB
                var generated = randToken.generate(16);
                Token.create({
                    user: username,
                    pass: password,
                    token: generated
                }, function(err, tk){
                    if(err){
                        res.send(err);
                    }
                    else{
                        res.send(generated);
                    }
                    console.log(tk);
                });
            }
        }
        );
    })

    app.post("/mail/validate", function(req, res){
        var received = req.body.token;
        token.find(
            {
                token: received
            },
            'user',
            function(err, result){
                if(err){
                    res.send("Not Valid");
                }
                else{
                    res.send("Success");
                }
            }
        )
    })
    