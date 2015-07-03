var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var User = mongoose.model('User');
var Project = mongoose.model('Project');

//Get all schemas in a project
router.get('/:id', function (req, res, next){
	User.find({ projects:  { "$in" : [req.params.id]} })
	.exec()
	.then(function (members) {
		res.status(200).json(members);
	})
	.then(null, next);
});

router.post('/:id', function (req, res, next){
	Promise.all([User.findOne(req.body).exec(), Project.findById(req.params.id).exec()])
	.spread(function (user, project) {
		if(user){
			user.pendingProjects.push(project._id);
			user.save();
		}
		return user
	})
	.then(function (user) {
		res.status(200).json(user);
	})
	.then(null, next);
});