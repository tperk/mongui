var mongoose = require('mongoose');
var router = require('express').Router();
module.exports = router;

var User = mongoose.model('User');

router.post('/', function(req, res, next) {
    var user = new User(req.body);
    user.save(function (err, newUser) {
        if(err) return next(err);
        res.send(newUser);
    });
});