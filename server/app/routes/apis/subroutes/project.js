var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var Schema = mongoose.model('Schema');
var Project = mongoose.model('Project');
var User = mongoose.model('User');

//Get all schemas in a project
router.get('/:id', function (req, res, next){
	Project.findById(req.params.id)
	.populate('schemas')
	.exec()
	.then(function (project) {
		res.status(200).json(project.schemas);
	})
	.then(null, next);
});

//Update one schema
router.put('/:id', function (req, res, next) {
	Schema.findOneAndUpdate({_id: req.params._id}, req.body)
	.exec()
	.then(function() {
		res.send("Updated");
	})
	.then(null, next);
});

//Post a new schema and append to current project
router.post('/:id', function (req, res, next){
	return Promise.all([Schema.create(req.body), Project.findById(req.params.id).exec()])
	.spread(function (schema, project) {
		project.schemas.push(schema._id);
		return project.save();
	})
	.then(function (savedProject) {
		res.status(200).json(savedProject);
	})
	.then(null, next);
});

//Delete a schema
router.delete('/:id', function (req, res, next){
	Schema.findByIdAndRemove(req.params.id)
	.then(function () {
		res.status(204).json('Deleted');
	})
	.then(null, next);
});