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
                        console.log($stateParams);
                        $state.go('project', {
                            projectid: $stateParams.projectid,
                            projectname: $stateParams.projectname
                        });
                    }
                    return schema;
                });
            },
            fields: function (SchemaFactory, currentSchema) {
                return SchemaFactory.getFieldsBySchemaId(currentSchema._id);
            },
            functions: function (SchemaFactory, currentSchema) {
                return SchemaFactory.getFunctionsBySchemaId(currentSchema._id);
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


app.controller('schemaCtrl', function ($scope, $mdSidenav, $mdDialog, $state, fields, functions, $stateParams, currentSchema, schemas, fieldFactory, SchemaFactory, functionFactory, $q) {

    $scope.schemas = schemas;
    $scope.currentSchema = currentSchema;

    $scope.fields = fields;
    $scope.fieldsChanged = {};

    $scope.functions = functions;
    $scope.functionsChanged = {};

    $scope.saving = false;
    $scope.exportSchema = currentSchema.exportSchema;

    $scope.openCodeDialog = function() {
        console.log('hitting code dialog');
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope, //use parent scope in template
            preserveScope: true,
            template:
                '<md-dialog>' +
                    '  <md-dialog-content>'+
                '       {{exportSchema}}' +
                '  </md-dialog-content>' +
                '  <div class="md-actions">' +
                '    <md-button ng-click="closeDialog()" class="md-primary">' +
                '      Close Dialog' +
                '    </md-button>' +
                '  </div>' +
                '</md-dialog>',
            controller: function DialogController($scope, $mdDialog) {
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                };

            }
        });
    };

// FIELDS

    $scope.updateFieldsChanged = function (){
        $scope.fieldsChanged = {};
        $scope.fields.forEach(function(field){
            $scope.fieldsChanged[field._id] = false;
        });
    };
    $scope.updateFieldsChanged();

    $scope.$on('fieldChanged', function(event, fieldId){
        $scope.fieldsChanged[fieldId] = true;
    });

    $scope.generateExportSchemaAndUpdate = function (fields, functions) {
        var exportSchema = '';

        fields.forEach(function (field) {
            exportSchema += field.generatedCode + ',' + '\n';
        });
        exportSchema = exportSchema.substring(0, exportSchema.length - 2);

        if (functions) {
            exportSchema += '\n';
        }

        functions.forEach(function (func) {
            exportSchema += func.generatedCode + '\n';
        });

        var schema = {
            exportSchema: exportSchema
        };

        SchemaFactory.updateSchema(schema, $stateParams.schemaid)
        .then(function (exportSchema) {
            $scope.exportSchema = exportSchema;
        })
        .catch(function(e) {console.log(e);});
    };

    $scope.saveUpdatedFields = function(){

        var fieldsPromises = function () {
            return $q(function (resolve, reject) {
                var fieldsToUpdate = [];
                for(var id in $scope.fieldsChanged){
                    if ($scope.fieldsChanged[id]) fieldsToUpdate.push(id);
                }

                var promises = [];

                fieldsToUpdate.forEach(function(fieldId){
                    var theField = $scope.fields.filter(function(field){
                        if(field._id === fieldId) return true;
                        else return false;
                    });
                    promises.push($scope.saveField(theField[0]._id, theField[0]));
                });
                console.log(promises);
                $q.all(promises);
                resolve();
            });
        };

        fieldsPromises().then(function () {
            console.log('after');
            $scope.updateFieldsChanged();

            $scope.generateExportSchemaAndUpdate($scope.fields, $scope.functions);
            
        });
    };


    // not in use
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
            $scope.updateFieldsChanged();
        });
    };

    $scope.createField = function(){
        console.log("called create field");
        fieldFactory.createField(currentSchema._id, {typeOptions: {stringEnums: [], array: false}})
        .then(function(field){
            $scope.fields.push(field);
            $scope.updateFieldsChanged();
        });
    };

    $scope.deleteField = function(field){
        console.log("called delete field");
        fieldFactory.deleteFieldById(field._id).then(function (response){
            $scope.setFieldsBySchemaId(currentSchema._id);
            $scope.updateFieldsChanged();
        });

    };

    $scope.saveField = function(id, field){
        
        $scope.saving = true;
        var fieldCopy = field;
        fieldCopy.generatedCode = fieldFactory.codeConverter(field);
        var justIds = field.children.map(function(child){
            if(typeof child === 'object'){return child._id;} 
            else {return child;}
        });
        fieldCopy.children = justIds;
        return fieldFactory.editFieldById(id, fieldCopy).then(function (response){
            $scope.saving = false;
            return;
        });
    };

    // not in use
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

//FUNCTIONS

    $scope.updateFunctionsChanged = function (){
        $scope.functionsChanged = {};
        $scope.functions.forEach(function(func){
            $scope.functionsChanged[func._id] = false;
        });
    };
    $scope.updateFunctionsChanged();

    $scope.$on('functionsChanged', function(event, funcId){
        $scope.functionsChanged[funcId] = true;
    });

    $scope.saveUpdatedFunctions = function(){

        var functionsPromises = function () {
            return $q(function (resolve, reject) {
                var functionsToUpdate = [];
                for(var id in $scope.functionsChanged){
                    if ($scope.functionsChanged[id]) functionsToUpdate.push(id);
                }
                var promises = [];

                functionsToUpdate.forEach(function(funcId){
                    var theFunc = $scope.functions.filter(function(func){
                        if(func._id === funcId) return true;
                        else return false;
                    });
                    console.log('promises push', theFunc[0]._id, theFunc[0]);
                    promises.push($scope.saveFunction(theFunc[0]._id, theFunc[0]));
                });
                console.log(promises);
                $q.all(promises);
                resolve();
            });
        };

        functionsPromises().then(function () {
            $scope.updateFunctionsChanged();

            $scope.generateExportSchemaAndUpdate($scope.fields, $scope.functions);
        });
    };


    // not in use
    $scope.setAllFuncitons = function(){
        console.log("called set all functions");
        functionFactory.getAllFunctions().then(function(functions){
            $scope.functions = functions;
        });
    };

    $scope.setFunctionsBySchemaId = function(schemaId) {
        console.log("called set functions by schema id");
        functionFactory.getAllFunctionsById(schemaId).then(function(functions){
            $scope.functions = functions;
            $scope.updateFunctionsChanged();
        });
    };

    $scope.createFunction = function(){
        console.log("called create function");
        functionFactory.createFunction(currentSchema._id, {typeOptions: {parameters: []}})
        .then(function(func){
            $scope.functions.push(func);
            $scope.updateFunctionsChanged();
        });
    };

    $scope.deleteFunction = function(func){
        console.log("called delete function");
        functionFactory.deleteFunctionById(func._id).then(function (response){
            $scope.setFunctionsBySchemaId(currentSchema._id);
            $scope.updateFunctionsChanged();
        });

    };

    $scope.saveFunction = function(id, func){
        $scope.saving = true;
        func.generatedCode = functionFactory.codeConverterFn(func);
        return functionFactory.editFunctionById(id, func).then(function (response){
            $scope.saving = false;
            return;
        });
    };
 
    $scope.typeChangeClearFn = function(func){
        console.log("called type change clear fn");
        func.typeOptions = {parameters: []};
        $scope.saveFunction(func._id, func).then(function(result){
            return;
        });
    };
});