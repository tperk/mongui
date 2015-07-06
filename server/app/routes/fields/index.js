var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var Field = mongoose.model('Field');
var Schema = mongoose.model('Schema');

//get all fields
router.get('/', function (req, res, next){
	Field.find({})
	.populate('children')
	.exec()
	.then(function (fields) {
		res.send(fields);
	})
	.then(null, next);
});

router.get('/:id', function (req, res, next){
	Field.findOne({_id: req.params.id})
	.populate('children')
	.exec()
	.then(function (field) {
		res.send(field);
	})
	.then(null, next);
});

// get all fields for a specific schema
router.get('/schema/:id', function (req, res, next) {
	Schema.findById(req.params.id).populate('fields').exec().then(function(schema){
		res.status(200).json(schema.fields);
	})
	.then(null, next);
});

//Post new field
router.post('/:id', function (req, res, next){


	return Promise.all([Field.create(req.body), Schema.findById(req.params.id).exec()])
		.spread(function (field, schema){
			console.log(field._id)
			schema.fields.push(field._id);
			schema.save();
			return field;
		})
		.then(function (savedField) {
			res.json(savedField);
		})
		.then(null, next);
});

// //Post new field
// //Uncomment when engine is moved into schemacontroller
// router.post('/:id', function (req, res, next){
// 	return Promise.all([Field.create(req.body), Schema.findById(req.params.id).exec()])
// 	.spread(function (field, schema){
// 		schema.fields.push(field._id);
// 		return schema.save();
// 	})
// 	.then(function (savedSchema) {
// 		console.log(savedSchema);
// 		res.status(200).json(savedSchema);
// 	})
// 	.then(null, next);
// });

// put by field ID
router.put('/:id', function (req, res, next){
	//using save instead of update to pre hook
	Field.findById({_id: req.params.id})
	.exec()
	.then(function (field){
		for (var prop in req.body) {
			if (prop !== '_id' && prop !== "__v") {
				field[prop] = req.body[prop]
			}
		}
		return field.save();
	})
	.then(function (field) {
		res.status(200).send(field);
	})
	.then(null, next);
});

// delete by field ID 
router.delete('/:id', function (req, res, next){
	Field.findById(req.params.id).exec()
		.then(function (field) {
			return field.nestedRemove();
		})
		.then(function () {
			res.send();
		}, next);
});
