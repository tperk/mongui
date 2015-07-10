var mongoose = require('mongoose');
var router = require('express').Router();
var Promise = require('bluebird');
module.exports = router;

var Project = mongoose.model('Project');

var fs = require('fs');
var mkdirp = require('mkdirp');
var child_process = require("child_process");
var publicDirectory = "/tmp/monguiProjects/public";

function publishNpm(directory, projectId, res){	
	var packageName = "mongui_pkg_" + projectId;
	var exec = Promise.promisify(child_process.exec);
	var wF = Promise.promisify(fs.writeFile);
	var rF = Promise.promisify(fs.readFile);
	var versionArr = [];
	var projectVersion = "";
	var obj;

	exec.call(child_process, "npm init -y", {cwd: directory}).then(function(data){
	    rF.call(fs, directory + "package.json").then(function(data){			
		    obj = JSON.parse(data);
		    obj.name = packageName;

		    Project.findById(projectId)
		    .exec()
		    .then(function(project){
		    	console.log("project", project);
		    	console.log("project version", project.version);
		    	

		    	if(project.version){
		    		projectVersion = project.version;
		    		versionArr = projectVersion.split('.');
				    versionArr[2]++; 
				    obj.version = versionArr.join('.');
				    project.version = obj.version;
		    	}else{
		    		project.version = "1.0.0";
		    	}
		    	project.save();
		    	wF.call(fs, directory + "package.json", JSON.stringify(obj, null, 2)).then(function(){
			    	child_process.exec('npm publish', {cwd: directory}, function (){
			    		removeFolder(projectId, directory);
						res.status(200).send("npm install " + packageName);
					});
				});
		    }); 
		});			
	});
}

function removeFolder (folderName, directory) {
	setTimeout(function () {
		console.log(directory);
		
		child_process.exec('rm -rf ../' + folderName, {cwd: directory});
	}, 600000);//remove folder after 10 min
}

function removeZip (fileName, directory) {
	setTimeout(function () {
		child_process.exec('rm ' + fileName, {cwd: directory});
	}, 600000);//remove file after 10 min
}

function createPackageDirectory (subDirectory, fileName, filestr) {
	mkdirp(subDirectory, function (err) {
    	var wF = Promise.promisify(fs.writeFile);
        return wF.call(fs, subDirectory + fileName + ".js", filestr).then(function(){
            return;
        });  
	});
}

function createPackage (schemasArr, projectId, npmElseZip, res) {
	var mainDirectory = "/tmp/monguiProjects/" + projectId +"/";
	mkdirp(mainDirectory, function (err) {
		Promise.all([
			Promise.map(schemasArr, function (schema) {
				var subDirectory = mainDirectory + "schema_files/schemas/";
				if(schema.exportSchema){
					return createPackageDirectory(subDirectory, schema.name, schema.exportSchema);
				}else return;
		
			}),
			Promise.map(schemasArr, function (schema) {
				var subDirectory = mainDirectory + "seed_files/seeds/";
				if(schema.exportSeed){
					return createPackageDirectory(subDirectory, schema.name, schema.exportSeed);
				}else return;
			})
		])
		.then(function(){
			var subDirectory = mainDirectory + "seed_files/";
			return Project.findById(projectId)
			.exec()
			.then(function (project) {	
				return createPackageDirectory(subDirectory, "index", project.seedIndexJS);
			});
		})
		.then(function(){
			if(npmElseZip){
				publishNpm(mainDirectory, projectId, res);
			}else{
				createZip (mainDirectory, projectId, res);
			}
		}).catch(function(e) {console.log(e);});
	});
}

function createZip (mainDirectory, projectId, res) {
	var packageName = "mongui_pkg_" + projectId;
	var fileName = packageName+".zip";
	mkdirp(publicDirectory, function (err) {
		var exec = Promise.promisify(child_process.exec);                   
	    return exec.call(child_process, "zip -r " + packageName + " ../" + projectId, {cwd: publicDirectory}).then(function(err){
	        removeFolder(projectId, mainDirectory);
	        removeZip(fileName, publicDirectory);
	        res.status(200).send(fileName);
	    }); 
	});
}

router.get('/:id', function (req, res, next){
	Project.getSchemas(req.params.id)
	.then(function (schemas) {
		createPackage(schemas, req.params.id, true, res);
	})
	.then(null, next);
});

router.get('/zip/:id', function (req, res, next){	
	Project.getSchemas(req.params.id)
	.then(function (schemas) {
		createPackage(schemas, req.params.id, false, res);
	})
	.then(null, next);
});
