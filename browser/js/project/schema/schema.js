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
                    console.log(schema)
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
            }
        },
        data: {
            authenticate: true
        }

    });

});

app.controller('schemaCtrl', function ($scope, $mdSidenav, $mdDialog, $state, fields, $stateParams, currentSchema, fieldFactory) {

    /* TODO
        1. create route that returns a flattend array of all the fields 
            in a given schema
        2. create an object on scope out of that array where 
            {
                field1_id: {field1},
                field2_id: {field2}...etc.
            }
        3. create an object on scope 
            $scope: topLevelFields = 
            {
                directive1: {object1},
                directive2: {object2}
            }
            each key (directive#) will correspond to a top level field on the schema
            the possible values will consist of any nested field 
            (you could get a list of top level fields by get all fields for schema without
            populating the children)
        4. update field directive so it ng-repeats="topLevelField in $scope.topLevelFields"
        5. Hopefully when we change the value of directive1 it should rerender
            the information displayed in that field directive
        6. on createSubField(), append a button / link to field-nested directive
        7. write function(field_id) on this controller to switch values of topLevelFields
        8. Pass that function to the field and field-nested directives using "&"
        9. on field directive link breadcrumbs to call that function using ids
        10. on field-nested directive link buttons / links to call that funciton using ids
    */

    $scope.currentSchema = currentSchema;
    $scope.fields = fields;
    $scope.saving = false;
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
        console.log("called save field");
        $scope.saving = true;
        var fieldCopy = field;
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

    $scope.openCodeDialog = function() {
        console.log('hitting code dialog')
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope, //use parent scope in template
            preserveScope: true,
            template:
                '<md-dialog>' +
                    '  <md-dialog-content>'+
                '       Here is your code, yo. {{fields | json}}' +
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
                }

            }
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

    //schema expects an object, path expects a simple path in the form 'key1.key2'
    // var schemaParser = function (schema, path) {
    //     var parsed = [];
    //     var finalObj = schema;
    //     function keyCounter (obj) {
    //         var count = 0;
    //         Object.keys(obj).forEach(function (key) {
    //             count += 1;
    //         });
    //         return (count > 0 );
    //     }
    //     path.split('.').forEach(function (link) {
    //         parsed.push({name: link, child: false});
    //         finalObj = finalObj[link];
    //     });
    //     if (keyCounter(finalObj)) {
    //         Object.keys(finalObj).forEach(function (key) {
    //             if (typeof(finalObj[key]) === 'object') {
    //                 parsed.push({name: key, child: true});
    //             }
    //         });
    //     }
    //     return parsed;
    // };

    // $scope.objectPath = schemaParser($scope.testSchema, $scope.currentPath);
});