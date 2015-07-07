var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var fs = require('fs');
var mkdirp = require('mkdirp');
//get all fields
router.post('/seed', function (req, res, next){
	var projectId = req.body.projectId;
	var schemaName = req.body.schemaName;
	var schemaStr = req.body.file;
	var directory = '/tmp/monguiProjects/' + projectId + '/seedFiles/';
    
	mkdirp(directory, function (err) {
	    if (err) console.error(err);
	    else {
	    	fs.writeFile(directory + schemaName + '.js', schemaStr, function(err){
	            if (err) throw err;
	            else {
	            	console.log(schemaName +' Saved');
	            	res.status(200).send("npm install mongui/" + projectId);
	            }
	        });
	    }
	});
});