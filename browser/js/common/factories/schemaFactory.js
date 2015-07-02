app.factory('SchemaFactory', function ($http){	
	return {
		getSchemaById: function(schemaId){
			return $http.get('/api/schemas/' + schemaId)
				.then(function (response){
					console.log("factory response is ", response)
					return response.data;
				});
		},
		schemaCreate: function(schemaObj, infoObj){
			var schemaTop = "var mongoose = require('mongoose');\nvar schema = new mongoose.Schema(";
			var schemaBottom = ');';
			var collectionName = infoObj.collectionName;
			 var infoStr = "";
			var prop, el, hooks, hookType, hook, innerObj;
			for (prop in infoObj) {
				if(prop === "custom"){
					innerObj = infoObj[prop];
					for(el in infoObj[prop]){
						infoStr += '\n' + innerObj[el].toString() + ';';
					}
				}else if(prop === "methods"){
					innerObj = infoObj[prop];
					for(el in infoObj[prop]){
						infoStr += "\nschema.method('"+innerObj[el].name+"', " + innerObj[el] + ");";
					}
				}else if(prop === "virtuals"){
					innerObj = infoObj[prop];
					for(el in infoObj[prop]){
						infoStr += "\nschema.virtual('"+innerObj[el].name+"', " + innerObj[el] + ");";
					}
				}else if(prop === "statics"){
					innerObj = infoObj[prop];
					for(el in infoObj[prop]){
						infoStr += "\nschema.static('"+innerObj[el].name+"', " + innerObj[el] + ");";
					}
				}else if(prop === "hooks"){
					hooks = infoObj[prop];
					for(hookType in hooks){
						var hookObj = hooks[hookType];
						if(hookType === "preSerial"){
							for(hook in hookObj){
								infoStr += "\nschema.pre('"+hookObj[hook].name+"', " + hookObj[hook] + ");";
							}
						}else if(hookType === "preParallel"){
							for(hook in hookObj){
								infoStr += "\nschema.pre('"+hookObj[hook].name+"', 'true', " + hookObj[hook] + ");";
							}
						}else if(hookType === "post"){
							for(hook in hookObj){
								infoStr += "\nschema.post('"+hookObj[hook].name+"', " + hookObj[hook] + ");";
							}
						}
					}
				}
			}			
			return schemaTop + JSON.stringify(schemaObj, null, 4) + schemaBottom + infoStr + "\nmongoose.model('"+ collectionName + "', schema)";
		}
	};
});