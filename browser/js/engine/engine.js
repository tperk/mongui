app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('engine', {
        url: '/engine',
        controller: 'EngineController',
        templateUrl: 'js/engine/engine.html',
        resolve: {
            schemas: function (SchemaFactory) {
                return SchemaFactory.getSchemas("559ad580a0f8971d026c66db");
            }
        }
    });

});

app.controller('EngineController', function ($scope, fieldFactory, schemas, TemplateFactory) {
    $scope.schemas = schemas
    console.log(" this is ", $scope.schemas)

    $scope.saving = false;

    $scope.setAllFields = function(){
        fieldFactory.getAllFields().then(function(fields){
            $scope.fields = fields;
        });
    };
    
    //schemaId will be accessable as $stateParams.id
    $scope.createField = function(schemaId){
        fieldFactory.createField({}, schemaId).then(function(field){
            $scope.fields.push(field);
        });
    };

    $scope.deleteField = function(field){
        fieldFactory.deleteFieldById(field._id).then(function (response){
            $scope.setAllFields();
        });

    };

    $scope.saveField = function(id, field){
        console.log(codeConverter(field))
        $scope.saving = true;
        var fieldCopy = field;
        var justIds = field.children.map(function(child){
            if(typeof child === 'object'){return child._id;} 
            else {return child;}
        });
        fieldCopy.children = justIds;
        return fieldFactory.editFieldById(id, fieldCopy).then(function (response){
            $scope.saving = false;
            $scope.setAllFields();
            return;
        });
    };

    $scope.createSubField = function(parent){
        var copyOfParents = parent.parents.slice();
        copyOfParents.push(parent._id);
        fieldFactory.createField({parents: copyOfParents}).then(function(child){
            var justIds = _.map(parent.children, function(child){
                if(typeof child === 'object'){
                    return child._id;
                } 
                else {
                    return child;
                }
            });
            parent.children = justIds;
            parent.children.push(child._id);
            $scope.saveField(parent._id, parent);
        });
    };

    $scope.typeChangeClear = function(field){
       field.typeOptions = {stringEnums: [], array: false};
        $scope.saveField(field._id, field).then(function(result){
            if(field.children.length){
                field.children.forEach(function(child){
                    $scope.deleteField({_id: child});
                });
            }
        });
    };

    $scope.setAllFields();
    // fieldFactory.createField({name: "test", required: false});

    var indent = TemplateFactory.indent

	var handleValue = function (value) {
		if (typeof value === 'string') {
			return  '"' + value + '"'
		} else if (Array.isArray(value)) {
			if (!value.length) {
				return '[]'
			} else {
				var out = ''
				value.forEach(function (subval) {
					out += handleValue(subval) + ','
				})
				out = out.substring(0, out.length - 1)
				return '[' + out + ']'
			}
		} else {
			//booleans, numbers
			return value
		}
	}

	function codeConverter (field) {
		// Number
		var out = ''
		out += field.name + ': ' + '\n'
		if (field.typeOptions.array) {
			out += '\n' + '[{' 
		} else {
			out += '{'
		}
		out += 'type: '+ field.fieldType + ', '
		if (field.required === true) {
			out += "required: true, "
		}
		for (var key in field.typeOptions) {
			if (key === 'stringEnums' || key === 'array') {
				if (key === 'stringEnums' && field.typeOptions.stringEnums.length > 0 && field.fieldType === 'String') {
					out += 'enum:' + handleValue(field.typeOptions[key]) + ', '
					continue
				} else {
					continue
				}
			} else {
				out += key + ': ' + handleValue(field.typeOptions[key]) + ', '
			}
		}
		out = out.substring(0, out.length - 2)
		if (field.typeOptions.array) {
			out += '}]'
		} else {
			out += '}'
		}
		return out
	}

	

});