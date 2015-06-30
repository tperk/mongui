var mongoose = require('mongoose');
var router = require('express').Router();
module.exports = router;

var User = mongoose.model('User');
var Project = mongoose.model('Project');

router.get('/', function (req, res, next){
	Project.find({})
	.populate('schemas')
	.exec()
	.then(function (projects) {
		res.send(projects);
	})
	.then(null, next);
});

router.post('/', function (req, res, next){
	Project.create(req.body.params)
	.then(function (project) {
		res.send('saved');
	}).
	then(null, next);
});