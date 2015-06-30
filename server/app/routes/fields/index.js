var mongoose = require('mongoose');
var router = require('express').Router();
module.exports = router;

var Field = mongoose.model('Field');

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

//Post new field
router.post('/', function (req, res, next){
	Field.create(req.body)
	.then(function (field) {
		res.send(field);
	})
	.then(null, next);
});
// put by field ID
router.put('/:id', function (req, res, next){
	Field.findByIdAndUpdate(req.params.id, req.body)
	.exec()
	.then(function (field){
		res.status(200).send(field);
	})
	.then(null, next);
});

// delete by field ID 
router.delete('/:id', function (req, res, next){
	Field.findByIdAndRemove(req.params.id)
	.exec()
	.then(function (){
		res.status(204).send();
	})
	.then(null, next);
});
