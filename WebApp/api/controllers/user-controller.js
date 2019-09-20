'use strict';

const userService = require('../services/user-service'),
        bcrypt = require('bcryptjs'),
        validator = require("email-validator");

const cloudwatchMetrics = require('cloudwatch-metrics');
var count = 0;

cloudwatchMetrics.initialize({
    region: 'us-east-1'
});

// var myMetric = new cloudwatchMetrics.Metric('UserEndpointHits', 'Count');
var myMetric = new cloudwatchMetrics.Metric('UserEndpointHits', 'Count', [{
    Name: 'environment',
    Value: 'PROD'
}]);

exports.register = function (req, res){
    count = count + 1;
    myMetric.put(count, 'UserEndpointHits');
    var username = req.body.username;
    console.log(req.body);
    userService.search(username, (result) => {
        console.log(result);
        if (result) {
            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
            if (req.body.username == null || req.body.password == null || !validator.validate(username)){
                res.status(400).json({sc:400,status:"Bad request - username should be an email - password should not be empty"});
                return;
            }
            let user = { userid: req.body.username, password: req.body.password };
            userService.insert(user, (err)=>{
                if (err) {
                    console.log(err);
                    res.status(400).json({sc:400,status:"User already exists"});
                } else {
                    console.log('new user added');
                    res.status(201).json({sc:201,status:"User added successfully"});
                }
            });
        } else if (result == false) {
            console.log(err);
            res.error.send("DB error");
        }
    });
}

exports.passwordReset = function (req, res){
    count = count + 1;
    myMetric.put(count, 'UserEndpointHits');
    console.log("Inside password");
    var username = req.body.username;
    var AWS = require('aws-sdk');
    AWS.config.update({region: "us-east-1"});
    var topicArn = process.env.TOPIC;
    console.log(req.body);
    console.log("Topic " + process.env.TOPIC);

    userService.search(username, (result) => {
        console.log(result);
        if (result) {

            if (result.length == 0 || !validator.validate(username)){
                res.status(400).json({sc:400,status:"Invalid Username/not registered"});
                return;
            }
            else {
                //SNS public topic
                console.log("username = " + username);
                var params = {
                    Message: username, /* required */
                    TopicArn: topicArn
                };
                var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
                publishTextPromise.then(
                    function(data) {
                        console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
                        console.log("MessageID is " + data.MessageId);
                    }).catch(
                    function(err) {
                        console.error(err, err.stack);
                    });
                res.status(200).json({status:'success'});
            }

        } else if (result == false) {
            console.log(err);
            res.error.send("DB error");
        }
    });
}

exports.time = function(req, res) {
    count = count + 1;
    myMetric.put(count, 'UserEndpointHits');
    var auth = req.headers['authorization'];
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();

    var creds = plain_auth.split(':');
    var username = creds[0];
    var password = creds[1];

    userService.search(username, (result)=>{
        if (result) {
            if (result.length == 0) {
                res.status(400).json({ error: "User not found" ,status:'fail'});
            }
            else if (bcrypt.compareSync(password, result[0].password)) {
                var d = new Date(2018, 11, 24, 10, 33, 30);
                res.status(200).json({login:"Logged in at " + d ,status:'success'});
            } else {
                res.status(400).json({ error: "incorrect password" ,status:'fail'});
            }
        } else if (result == false) {
            console.log(err);
            res.error.send("DB error");
        }
    });

}