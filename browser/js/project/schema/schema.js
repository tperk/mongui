app.config(function ($stateProvider) {

    $stateProvider.state('project.schema', {
        url: '/project/schema/:schemaid',
        templateUrl: 'js/project/schema/schema.html',
        controller: 'schemaCtrl',
        ncyBreadcrumb: {
            label: 'Schema page'
        },
        resolve: {
            currentSchema: function (SchemaFactory, $stateParams, $state){
                return SchemaFactory.getSchemaById($stateParams.schemaid).then(function(schema) {
                    if (!schema) {
                        console.log($stateParams)
                        $state.go('project', {
                            projectid: $stateParams.projectid,
                            projectname: $stateParams.projectname
                        })
                    }
                    return schema;
                });
            },
            fields: function (SchemaFactory, currentSchema) {
                return SchemaFactory.getFieldsBySchemaId(currentSchema._id);
            },
            schemas: function (SchemaFactory, $stateParams) {
                return SchemaFactory.getSchemas($stateParams.projectid);
            }
        },
        data: {
            authenticate: true
        }

    });

});

app.controller('schemaCtrl', function ($scope, $mdSidenav, $state, fields, $stateParams, currentSchema, schemas, fieldFactory) {

    $scope.schemas = schemas
    $scope.currentSchema = currentSchema;
    $scope.fields = fields;
    $scope.saving = false;
    $scope.exportCode = currentSchema.exportSchema

    console.log("Fields for this schema are", $scope.fields)

    $scope.setAllFields = function(){
        console.log("called set all fields");
        fieldFactory.getAllFields().then(function(fields){
            $scope.fields = fields;
        });
    };

    $scope.setFieldsBySchemaId = function(schemaId) {
        console.log("called set fields by schema id");
        fieldFactory.getAllFieldsById(schemaId).then(function(fields){
            $scope.fields = fields;
        });
    };

    $scope.createField = function(){
        console.log("called create field");
        fieldFactory.createField(currentSchema._id).then(function(field){
            $scope.fields.push(field);
        });
    };

    $scope.deleteField = function(field){
        console.log("called delete field");
        fieldFactory.deleteFieldById(field._id).then(function (response){
            $scope.setFieldsBySchemaId(currentSchema._id);
        });

    };

    $scope.saveField = function(id, field){
        console.log(codeConverter(field))
        console.log("called save field");
        $scope.saving = true;
        var fieldCopy = field;
        fieldCopy.generatedCode = codeConverter(field)
        var justIds = field.children.map(function(child){
            if(typeof child === 'object'){return child._id;} 
            else {return child;}
        });
        fieldCopy.children = justIds;
        return fieldFactory.editFieldById(id, fieldCopy).then(function (response){
            $scope.saving = false;
            $scope.setFieldsBySchemaId(currentSchema._id);
            return;
        });
    };

    $scope.createSubField = function(parent){
        console.log("called create sub field");
        var copyOfParents = parent.parents.slice();
        copyOfParents.push(parent._id);
        fieldFactory.createField(currentSchema._id,{parents: copyOfParents}).then(function(child){
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
        console.log("called type change clear");
        field.typeOptions = {stringEnums: [], array: false};
        $scope.saveField(field._id, field).then(function(result){
            if(field.children.length){
                field.children.forEach(function(child){
                    $scope.deleteField({_id: child});
                });
            }
        });
    };

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
        out += field.name + ': ' 
        if (field.typeOptions.array) {
            out += '[{'
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
                } else {
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

    function generateExportSchema () {
        var fieldCodes = []
        $scope.fields.forEach(function (field) {
            fieldCodes.push(field)
        })
        
    }
});