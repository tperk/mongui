var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var Func = mongoose.model('Func');
var Schema = mongoose.model('Schema');

//get all functions
router.get('/', function (req, res, next){
	Func.find({})
	.exec()
	.then(function (funcs) {
		res.json(funcs);
	})
	.then(null, next);
});

//get one function
router.get('/:id', function (req, res, next){
	Func.findOne({_id: req.params.id})
	.exec()
	.then(function (func) {
		res.json(func);
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


	return Promise.all([Func.create(req.body), Schema.findById(req.params.id).exec()])
		.spread(function (func, schema){
			schema.functions.push(func._id);
			schema.save();
			return func;
		})
		.then(function (savedFunc) {
			res.json(savedFunc);
		})
		.then(null, next);
});

// put by function ID
router.put('/:id', function (req, res, next){
	//using save instead of update to pre hook
	Func.findById({_id: req.params.id})
	.exec()
	.then(function (func){
		for (var prop in req.body) {
			func[prop] = req.body[prop]
		}
		func.save();
		res.status(200).send(func);
	})
	.then(null, next);
});

// delete by field ID 
// router.delete('/:id', function (req, res, next){
// 	Func.findOne({_id: req.params.id}).exec().then(function(func){
// 		func.remove();
// 	}).then(function(){
// 		res.send();
// 	}).then(null, next);
// });

router.delete('/:id', function (req, res, next){
	Func.findByIdAndRemove(req.params.id)
	.exec()
	.then(function(deletedFunction){		
		res.send();
	}).then(null, next);
});
