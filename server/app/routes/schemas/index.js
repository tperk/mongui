var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var Field = mongoose.model('Field');
var Schema = mongoose.model('Schema');

router.get('/:id', function (req, res, next){
	console.log("hit backend route")
	Schema.findOne({_id: req.params.id})
	.exec()
	.then(function (schema) {
		console.log("the schema is", schema);
		res.send(schema);
	})
	.then(null, next);
});