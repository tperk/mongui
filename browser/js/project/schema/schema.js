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

app.controller('schemaCtrl', function ($scope, $mdSidenav, $state, fields, $stateParams, currentSchema, fieldFactory) {

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

    $scope.saving = false;
    $scope.currentSchema = currentSchema;
    $scope.fields = fields;
    $scope.fieldsDictionary = {};
    $scope.topLevelFields = {};
    $scope.fields.forEach(function (field){
        console.log("not even in here i bet");
        $scope.fieldsDictionary[field._id] = field;
        if(!field.parents.length){
            $scope.topLevelFields[field._id] = field;
        }
    });

    console.log("top level Fields for this schema are", $scope.topLevelFields);

    $scope.changeNestedView = function (fieldId){
        console.log("hit inside nested view");
        var topLevelId = $scope.fieldsDictionary[fieldId].parents[0] || fieldId;
        $scope.topLevelFields[topLevelId] = $scope.fieldsDictionary[fieldId];
    };

    $scope.$on('changeNestedView', function (event, data){
        console.log("heard ya bro!");
        $scope.changeNestedView(data);
    });

    $scope.rerenderFields = function (){
        console.log("RERENDERING")
        $scope.fields.forEach(function (field){
            $scope.fieldsDictionary[field._id] = field;
            if(!field.parents.length && !$scope.topLevelFields[field._id]){
                $scope.topLevelFields[field._id] = field;
            }
        });
    };

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
            $scope.rerenderFields();
        });
    };

    $scope.createField = function(){
        console.log("called create field");
        fieldFactory.createField(currentSchema._id).then(function(field){
            $scope.fields.push(field);
            $scope.rerenderFields();
        });
    };

    $scope.deleteField = function(field){
        console.log("called delete field");
        fieldFactory.deleteFieldById(field._id).then(function (response){
            $scope.setFieldsBySchemaId(currentSchema._id);
            $state.reload();
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