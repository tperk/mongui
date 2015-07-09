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
            schemas: function (SchemaFactory, $stateParams) {
                return SchemaFactory.getSchemas($stateParams.projectid);
            }
        },
        data: {
            authenticate: true
        }

    });

});


app.controller('schemaCtrl', function ($scope, $mdSidenav, $mdDialog, $state, fields, $stateParams, currentSchema, schemas, fieldFactory, SchemaFactory, $q) {

    $scope.schemas = schemas;
    $scope.currentSchema = currentSchema;
    $scope.fields = fields;
    $scope.fieldsChanged = {};
    $scope.saving = false;
    $scope.exportSchema = currentSchema.exportSchema;
    
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

    $scope.saveUpdatedFields = function(){

        var fieldsPromises = function () {
            return $q(function (resolve, reject) {
                var fieldsToUpdate = [];
                for(var id in $scope.fieldsChanged){
                    if ($scope.fieldsChanged[id]) fieldsToUpdate.push(id);
                }

                var promises = []

                fieldsToUpdate.forEach(function(fieldId){
                    var theField = $scope.fields.filter(function(field){
                        if(field._id === fieldId) return true;
                        else return false;
                    });
                    promises.push($scope.saveField(theField[0]._id, theField[0]));
                });
                console.log(promises)
                $q.all(promises)
                resolve();
            })
        }

        fieldsPromises().then(function () {
            console.log('after')
            $scope.updateFieldsChanged();

            var schema = {
                exportSchema: fieldFactory.generateExportSchema($scope.fields)
            }

            SchemaFactory.updateSchema(schema, $stateParams.schemaid)
            .then(function (exportSchema) {
                $scope.exportSchema = exportSchema
            })
            .catch(function(e) {console.log(e)});
        })
    }


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

    $scope.openCodeDialog = function() {
        console.log('hitting code dialog')
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

    
});