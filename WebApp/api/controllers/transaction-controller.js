'use strict';
const transactionService = require('../services/transaction-service');
const userService = require('../services/user-service');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
const cloudwatchMetrics = require('cloudwatch-metrics');

cloudwatchMetrics.initialize({
    region: 'us-east-1'
});
var myMetric2 = new cloudwatchMetrics.Metric('TransactionEndpointHits', 'Count', [{
    Name: 'environment',
    Value: 'PROD'
}]);

exports.list = function(req, res){
    myMetric2.put(1, 'TransactionEndpointHits');
    var auth = req.headers['authorization'];
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();
    var creds = plain_auth.split(':');
    var userid = creds[0];
    var password = creds[1];
    userService.search(userid, (result) => {
        if (result) {
            if (result.length == 0) {
                res.status(400).json({ error: "User not found", status: 'fail' });
            }
            else if (bcrypt.compareSync(password, result[0].password)) {
                console.log(userid);
                transactionService.list(userid, (err, result) => {
                    if (err != '') {
                        console.log(err);
                        res.status(400).json({ sc: 400, status: "DB err" });
                    }
                    res.status(200).json(result);
                })
            } else {
                res.status(400).json({ error: "incorrect password", status: 'fail' });
            }
        } else if (result == false) {
            console.log(err);
            res.error.send("DB error");
        }
    });
    
}

exports.add = function(req, res){
    myMetric2.put(1, 'TransactionEndpointHits');
    var auth = req.headers['authorization'];
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();
    var creds = plain_auth.split(':');
    var userid = creds[0];
    var password = creds[1];
    userService.search(userid, (result) => {
        if (result) {
            if (result.length == 0) {
                res.status(400).json({ error: "User not found", status: 'fail' });
            }
            else if (bcrypt.compareSync(password, result[0].password)) {
                let transaction = {
                    id: uuidv1(),
                    description: req.body.description,
                    merchant: req.body.merchant,
                    amount: req.body.amount,
                    date: req.body.date,
                    category: req.body.category,
                    userid: userid
                };
                transactionService.add(transaction, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(400).send("Bad Request");
                        return;
                    }
                    res.status(201).send("Created");
                }); 
            } else {
                res.status(400).json({ error: "incorrect password", status: 'fail' });
            }
        } else if (result == false) {
            console.log(err);
            res.error.send("DB error");
        }
    });
}

exports.update = function(req, res){
    myMetric2.put(1, 'TransactionEndpointHits');
    var auth = req.headers['authorization'];
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();
    var creds = plain_auth.split(':');
    var userid = creds[0];
    var password = creds[1];
    userService.search(userid, (result) => {
        if (result) {
            if (result.length == 0) {
                res.status(400).json({ error: "User not found", status: 'fail' });
            }
            else if (bcrypt.compareSync(password, result[0].password)) {
                console.log("the request id sent is " + req.params['id']);
                transactionService.search(req.params['id'], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(400).send("Bad request");
                    }
                    if (result.length == 0) {
                        res.status(400).send("Bad request");
                        return;
                    }
                    if (result[0].userid === userid) {
                        let updatedTr = req.body;
                        updatedTr['id'] = req.params.id;
                        transactionService.update( updatedTr, (err) => {
                            if (err) {
                                console.log(err);
                                res.status(400).json({ sc: 400, status: "Bad request" });
                                return;
                            }
                            res.status(201).json({ sc: 201, status: "Created/Updated - Invalid keys, if passed will be ignored" });
                        })
                    } else
                        res.status(401).send("Unauthorized");
                })
            } else {
                res.status(400).json({ error: "incorrect password", status: 'fail' });
            }
        } else if (result == false) {
            console.log(err);
            res.error.send("DB error");
        }
    });
    

}

exports.delete = function(req, res){
    myMetric2.put(1, 'TransactionEndpointHits');
    var auth = req.headers['authorization'];
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();
    var creds = plain_auth.split(':');
    var userid = creds[0];
    var password = creds[1];
    userService.search(userid, (result) => {
        if (result) {
            if (result.length == 0) {
                res.status(400).json({ error: "User not found", status: 'fail' });
            }
            else if (bcrypt.compareSync(password, result[0].password)) {
                transactionService.search(req.params['id'], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(400).send("Bad request");
                    }
                    if (result.length == 0) {
                        res.status(400).send("Bad request");
                        return;
                    }
                    if (result[0].userid === userid) {
                        transactionService.delete(req.params['id'], (err) => {
                            if (err) {
                                console.log(err);
                                res.status(400).send("Bad request");
                            }
                            res.status(204).send();
                        })
                    } else
                        res.status(401).send("Unauthorized");
                })
            } else {
                res.status(400).json({ error: "incorrect password", status: 'fail' });
            }
        } else if (result == false) {
            console.log(err);
            res.error.send("DB error");
        }
    });
}

exports.addAttachment = function(req, res){
    myMetric2.put(1, 'TransactionEndpointHits');
    var auth = req.headers['authorization'];
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();
    var creds = plain_auth.split(':');
    var userid = creds[0];
    var password = creds[1];
    userService.search(userid, (result) => {
        if (result) {
            if (result.length == 0) {
                res.status(400).json({ error: "User not found", status: 'fail' });
            }
            else if (bcrypt.compareSync(password, result[0].password)) {
                if (!req.files)
                    return res.status(400).json({ error: "file not found", status: 'fail' });
                let sampleFile = req.files.sampleFile;
                console.log(sampleFile);
                sampleFile.mv('C:\\Users\\yoges\\Desktop\\server\\filename.jpg', function(err) {
                    if (err)
                        return res.status(500).send(err);

                    // res.send('File uploaded!');
                    res.status(200).json({ error: "File uploaded", status: 'success' });
                });
                // let transaction = {
                //     id: uuidv1(),
                //     description: req.body.description,
                //     merchant: req.body.merchant,
                //     amount: req.body.amount,
                //     date: req.body.date,
                //     category: req.body.category,
                //     userid: userid
                // };
                // transactionService.add(transaction, (err) => {
                //     if (err) {
                //         console.log(err);
                //         res.status(400).send("Bad Request");
                //         return;
                //     }
                //     res.status(201).send("Created");
                // });

            } else {
                res.status(400).json({ error: "incorrect password", status: 'fail' });
            }
        } else if (result == false) {
            console.log(err);
            res.error.send("DB error");
        }
    });
}