var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var Project = mongoose.model('Project')

var fs = require('fs');
var mkdirp = require('mkdirp');

function publishNpm(directory, projectId){	
	var packageName = "mongui_pkg_" + projectId;
	var child_process = require("child_process");
	child_process.exec("npm init -y", {cwd: directory}, function (err, stdout, stderr){
		fs.readFile(directory+"/"+"package.json", function read(err, data) {
		    if (err) console.log(err);
		    var obj = JSON.parse(data);
		    obj.name = packageName;
		    var versionArr = obj.version.split('.');
		    versionArr[2]++; 
		    obj.version = versionArr.join('.');

		    fs.writeFile(directory + "package.json", JSON.stringify(obj, null, 2), function(err){
		        if (err) console.log(err);
		        else {
		        	child_process.exec('npm publish', {cwd: directory}, function (err, stdout, stderr){
						res.status(200).send("npm install " + packageName);
					});
		        }
			});
		});
	});	
};

function createPackageDirectory (subDirectory, fileName, filestr) {
	mkdirp(subDirectory, function (err) {
	    if (err) console.log(err);
	    else {
	    	fs.writeFile(subDirectory + fileName + ".js", filestr, function(err){
	            if (err) console.log(err);
	        });
	    }
	});
}
function createPackage (schemasArr, projectId) {
	var mainDirectory = "/tmp/monguiProjects/" + projectId +"/"

	Promise.map(schemasArr, function (schema) {
			

		var subDirectory = mainDirectory + "seed_files/";
		var subDirectory = mainDirectory + "schema_files/";

		CreatePackageDirectory(subDirectory, schema.name, file);
		createPackageDirectory(subDirectory, schema.name, file);


		




	}).then(function(){
		publishNpm(mainDirectory, projectId);
	});
	

	// var schemaName = req.body.schemaName;
	// var schemaStr = req.body.file;
	// var subDirectory = mainDirectory + "seed_files/";


	//get all schemas and loop through the seed and schema code fields adding them with write file
	//use async map with promiseall and call publishnpm when promiseall resolves
	// mkdirp(subDirectory, function (err) {
	//     if (err) console.log(err);
	//     else {
	//     	fs.writeFile(subDirectory + schemaName + ".js", schemaStr, function(err){
	//             if (err) console.log(err);
	//             else {
	//             	publishNpm(mainDirectory, projectId);
	//             }
	//         });
	//     }
	// });


};

router.get('/:id', function (req, res, next){
	Project.getSchemas(req.params.id)
	.then(function (schemas) {
		createPackageDirectory(schemas, req.params.id);
	})
	.then(null, next);
});
