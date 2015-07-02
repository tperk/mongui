var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var User = mongoose.model('User');
var Project = mongoose.model('Project');

router.get('/:id', function (req, res, next){
	User.findById(req.params.id)
	.populate('projects')
	.exec()
	.then(function (user) {
		res.send(user.projects);
	})
	.then(null, next);
});

router.post('/:id', function (req, res, next){
	return Promise.all([Project.create(req.body.params), User.findById(req.params.id).exec()])
	.spread(function (project, user){
		user.projects.push(project._id);
		return user.save();
	})
	.then(function (savedUser) {
		res.status(200).json(savedUser);
	})
	.then(null, next);
});