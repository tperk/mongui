app.config(function ($stateProvider) {
	$stateProvider.state('seed', {
        url: '/seed',
        templateUrl: 'js/reference/seed.html',
        controller: 'SeedCtrl',
        resolve: {
            user: function (AuthService) {
                return AuthService.getLoggedInUser();
            },
            projects: function (ProjectsFactory, user) {
                return ProjectsFactory.getProjects(user._id);
            }
        },
        data: {
            authenticate: true
        }
    });

    $stateProvider.state('database', {
        url: '/database/:projectid',
        templateUrl: 'js/reference/seed-Database.html',
        controller: 'SeedDatabaseCtrl',
        resolve: {
            user: function (AuthService) {
                return AuthService.getLoggedInUser();
            },
            schemas: function (SchemaFactory, $stateParams) {
        		return SchemaFactory.getSchemas($stateParams.projectid);
        	},
        },
        data: {
            authenticate: true
        }
    });

    $stateProvider.state('database.collection', {
        url: '/collection/:projectid/:schemaid',
        templateUrl: 'js/reference/seed-Collection.html',
        controller: 'SeedCollectionCtrl',
        resolve: {
            user: function (AuthService) {
                return AuthService.getLoggedInUser();
            },
            currentSchema: function (SchemaFactory, $stateParams, $state){
                return SchemaFactory.getSchemaById($stateParams.schemaid).then(function(schema) {
                    return schema;
                });
            },
            fields: function (SchemaFactory, currentSchema) {
                return SchemaFactory.getFieldsBySchemaId(currentSchema._id);
            },
            schemas: function (SchemaFactory, $stateParams) {
        		return SchemaFactory.getSchemas($stateParams.projectid);
        	},
        	currentProject: function (ProjectsFactory, $stateParams) {
        		return ProjectsFactory.getProject($stateParams.projectid);
        	}
        },
        data: {
            authenticate: true
        }
    });
});

app.filter('excludeSelf', function () {
	return function(fields, schema) {
		fields.forEach(function(field, index){
			if(field.name === schema.name){
				fields.splice(index, 1);
			}
		});
		return fields;
	};
});

//input schema output seed.js
app.controller('SeedCtrl', function ($scope, $state, user, projects) {
	$scope.projects = projects;
    $scope.goToProject = function (projectId, projectName) {    	
        $state.go('database', {projectid: projectId});
    };
});

app.controller('SeedDatabaseCtrl', function ($scope, $state, user, schemas, $stateParams) {
	$scope.schemas = schemas;
	$scope.projectid = $stateParams.projectid;	
});

app.controller('SeedCollectionCtrl', function ($scope, $state, user, fields, TemplateFactory, schemas, currentSchema, SchemaFactory, PackageFactory, $stateParams, ProjectsFactory, currentProject) {
	$scope.fields = fields;	
	$scope.schemas = schemas;
	$scope.fieldNames = [];
	$scope.seedFile = null;
	$scope.currentSchema = currentSchema;
	var seedFields = [];
	fields.forEach(function(el){
		$scope.fieldNames.push(el.name);
	});

	$scope.changeMixedType = function (field) {
		field.wasMixed = true;
		field.fieldType = field.fieldType.trim();
		$scope.addSeedOptions(field);
	};

	$scope.backToProject = function() {
		console.log("CLicked")
		$state.go('project', {projectid: currentProject._id, projectname: currentProject.name})
	}
	$scope.addSeedFileToSchema = function () {
		currentSchema.exportSeed = $scope.seedFile;
		SchemaFactory.updateSchema(currentSchema, currentSchema._id).then(function(message){
			currentProject.seedIndexJS = TemplateFactory.createSeedIndexJS(currentProject.name, schemas);
			ProjectsFactory.updateProject($stateParams.projectid, currentProject).then(function(message){
				console.log(message);//display message
			}).catch(function(e) {console.log(e);});
		}).catch(function(e) {console.log(e);});
	};

	$scope.changeQuantity = function (quantity) {		
		var diff = quantity - seedFields.length;
		if(diff > 0){
			var i;
			for (i = 0; i < diff; i++){
				seedFields.push({});
			}
		}else if(diff < 0){
			seedFields = seedFields.slice(0, quantity);
		}
		$scope.seedFile = TemplateFactory.createSeedFile(currentSchema, seedFields);			
	};

	$scope.changeSeedByType = function (seedBy, val, type){
		seedBy.random = null;
		seedBy.schema = null;
		seedBy.custom = null;
		seedBy[type] = val;
		seedBy.type = type;
	};

	$scope.seedField = function (field) {
		$scope.seedFile = TemplateFactory.createSeedFile(currentSchema, seedFields, field);
	};

	$scope.addSeedOptions = function (field) {
		switch (field.fieldType) {
		    case 'String':
		        field.seedOptions = [{
					category:"name",
					items:['firstName', 'lastName', 'findName', 'prefix', 'suffix']
				},{
					category:"address",
					items:['zipCode', 'city', 'cityPrefix', 'citySuffix', 'streetName', 'streetAddress', 'streetSuffix', 'secondaryAddress', 'county', 'country', 'state', 'stateAbbr', 'latitude', 'longitude']
				},{
					category:"phone",
					items:['phoneNumber', 'phoneNumberFormat', 'phoneFormats']
				},{
					category:"internet",
					items:['avatar', 'email', 'userName', 'domainName', 'domainSuffix', 'domainWord', 'ip', 'userAgent', 'color', 'password']
				},{
					category:"company",
					items:['suffixes', 'companyName', 'companySuffix', 'catchPhrase', 'bs', 'catchPhraseAdjective', 'catchPhraseDescriptor', 'catchPhraseNoun', 'bsAdjective', 'bsBuzz', 'bsNoun']
				},{
					category:"image",
					items:['image', 'avatarImage', 'imageUrl', 'abstractImage', 'animalsImage', 'businessImage', 'catsImage', 'cityImage', 'foodImage', 'nightlifeImage', 'fashionImage', 'peopleImage', 'natureImage', 'sportsImage', 'technicsImage', 'transportImage']
				},{
					category:"lorem",
					items:['words', 'sentence', 'sentences', 'paragraph', 'paragraphs', 'array_element']
				},{
					category:"finance",
					items:['account', 'accountName', 'mask', 'amount', 'transactionType', 'currencyCode', 'currencyName', 'currencySymbol']
				},{
					category:"hacker",
					items:['abbreviation', 'adjective', 'noun', 'verb', 'ingverb', 'phrase']
				}];
		        break;
		    case 'Number':
		        field.seedOptions = [{
					category:"random",
					items:['number']
				}];
		        break;
		    case 'Date':
		        field.seedOptions = [{
					category:"date",
					items:['past', 'future', 'recent']
				}];
		        break;
	   //      case 'Buffer':
		  //       field.seedOptions = [{
				// 	category:"buffer",
				// 	items:[]
				// }];
		  //       break;
	        case 'Boolean':
		        field.seedOptions = [{
					category:"boolean",
					items:['random', 'true', 'fasle']
				}];
		        break;
	        case 'Mixed':
	        	field.seedOptions = [{
			        category:"mixed",
					items:[]
				}];
		        break;
		    case 'Objectid':
		        field.seedOptions = [{
					category:"objectid",
					items:['new id']
				}];
		        break;
	        case 'Nested':
		        field.seedOptions = [{
					category:"nested",
					items:[]
				}];
		        break;
		}
	};
});