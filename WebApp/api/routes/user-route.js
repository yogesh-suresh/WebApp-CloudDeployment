'use strict';
module.exports = function (app) {
    const userController = require('../controllers/user-controller');
    app.route('/datetime2').get(verify, userController.time);
    app.route('/user/register').post(userController.register);
    app.route('/forgot').post(userController.passwordReset);

    function verify(req, res, next) {
        const bearerHead = req.headers['authorization'];
        if (bearerHead == undefined) {
            res.status(403).send('User not logged in');
        } else {
            req.token = bearerHead;
            next();
        }
    }
}
