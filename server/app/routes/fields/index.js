var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var Field = mongoose.model('Field');
var Schema = mongoose.model('Schema');

var childDelete = function(parentId){
	console.log("child delete called on ", parentId);
	return Field.findOne({_id: parentId}).exec().then(function(parent){
		var deletedChildren = parent.children.map(function(child){
			return childDelete(child);
		});
		deletedChildren.push(Field.findByIdAndRemove(parent._id).exec());
		return Promise.all(deletedChildren);
	});
};

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

// router.delete('/children/:id', function (req, res, next) {
// 	Field.find({_id: req.params.id})
// 	.populate('children')
// 	.exec()
// 	.then(function (fields) {
// 		fields.forEach(function(field) {
// 			if(field.children) {

// 			}
// 		})
// 	})
// })

// get by field ID
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
	Schema.findOneById(req.params.id)
	.populate('fields')
	.exec()
	.then(function (schema) {
		res.status(200).json(schema.fields)
	})
	.then(null, next);
});

//Post new field
router.post('/', function (req, res, next){
	Field.create(req.body)
	.then(function (field) {
		res.send(field);
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
	Field.findByIdAndUpdate(req.params.id, req.body, {"new": true})
	.exec()
	.then(function (field){
		res.status(200).send(field);
	})
	.then(null, next);
});

// delete by field ID 
router.delete('/:id', function (req, res, next){
	childDelete(req.params.id).then(function (){
		res.status(204).send();
	})
	.then(null, next);
});
