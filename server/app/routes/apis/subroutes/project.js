var mongoose = require('mongoose');
var router = require('express').Router();
module.exports = router;

var Schema = mongoose.model('Schema');

router.get('/', function (req, res, next){
	Schema.find({})
	.exec()
	.then(function (schemas) {
		res.send(schemas);
	})
	.then(null, next);
});

router.put('/', function (req, res, next) {
	Schema.findOneAndUpdate({_id: req.body._id}, req.body)
	.exec()
	.then(function() {
		res.send("Updated");
	})
	.then(null, next);
});

router.post('/', function (req, res, next){
	Schema.create(req.body.params)
	.then(function (schema) {
		res.send('saved');
	}).
	then(null, next);
});