var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var Function = mongoose.model('Function');
var Schema = mongoose.model('Schema');

//get all functions
router.get('/', function (req, res, next){
	Function.find({})
	.exec()
	.then(function (functions) {
		res.json(functions);
	})
	.then(null, next);
});

//get one function
router.get('/:id', function (req, res, next){
	Function.findOne({_id: req.params.id})
	.exec()
	.then(function (function) {
		res.json(function);
	})
	.then(null, next);
});

// get all functions for a specific schema
router.get('/schema/:id', function (req, res, next) {
	Schema.findById(req.params.id).populate('functions').exec().then(function(schema){
		res.status(200).json(schema.functions);
	})
	.then(null, next);
});

//Post new function
router.post('/:id', function (req, res, next){


	return Promise.all([Function.create(req.body), Schema.findById(req.params.id).exec()])
		.spread(function (function, schema){
			schema.functions.push(function._id);
			schema.save();
			return function;
		})
		.then(function (savedFunction) {
			res.json(savedFunction);
		})
		.then(null, next);
});

// put by function ID
router.put('/:id', function (req, res, next){
	//using save instead of update to pre hook
	Function.findById({_id: req.params.id})
	.exec()
	.then(function (function){
		for (var prop in req.body) {
			function[prop] = req.body[prop]
		}
		function.save();
		res.status(200).send(function);
	})
	.then(null, next);
});

// delete by field ID 
router.delete('/:id', function (req, res, next){
	Function.findOne({_id: req.params.id}).exec().then(function(function){
		function.remove();
	}).then(function(){
		res.send();
	}).then(null, next);
});
