app.factory('functionFactory', function ($http) {
	
    var indent = function (str, numOfIndents) {
        var indentString = "";
        for(var i=0; i<numOfIndents; i++){
            indentString = "    " + indentString;
        }
        str = indentString + str;
        return "\n"+str;
    };

    function parametersHandler (parameters) {
        var out = ''
        parameters.forEach(function (parameter) {
            out += parameter + ','
        })
        out = out.substring(0, out.length - 2)
        console.log(out)
        return out
    }


    function codeConverter (func) {
        var out = ''

        if (!func.typeOptions.func) {
            func.typeOptions.func = ''
        }

        var makefunc = 'function (' + parametersHandler(func.typeOptions.parameters) + ') {' + indent(func.typeOptions.func, 1) + '\n' + '});'
        if (func.functionType === 'Getter/Setter') {
            out += 'function ' + func.name + ' (val) {' + func.typeOptions.func + '};'
        } else {
            out += 'schema.'
            if (func.functionType === 'Virtual') {
                out += 'virtual("' + func.typeOptions.field + '").' + func.typeOptions.getset + 
                '(' + makefunc
            } else if (func.functionType === 'Hook') {
                out += func.typeOptions.completion + '("' + func.typeOptions.event + '", '
                if (func.typeOptions.flow === "Parallel") {
                    out += 'true, '
                }
                out += makefunc
            } else {
                out += func.functionType.toLowerCase() + 's.' + func.name + ' = ' + makefunc
                out = out.substring(0, out.length - 1)
                out += ';'
            }

        }
        return out
    }

	return {
		getAllFunctions: function(){
			return $http.get('/api/functions/')
			.then(function (response){
				return response.data;
			});
		},
		getAllFunctionsById: function (schemaId) {
			return $http.get('/api/functions/schema/' + schemaId)
			.then(function (functions) {
				return functions.data;
			});
		},
        getFunctionById: function(functionId){
            return $http.get('/api/functions/' + functionId)
            .then(function (response){
                return response.data;
            });
        },
        createFunction: function(schemaId, body){
            return $http.post('/api/functions/' + schemaId, body)
            .then(function (response){
                return response.data;
            });
        },
        editFunctionById: function(functionId, updatedFunction){
            return $http.put('/api/functions/' + functionId, updatedFunction)
            .then(function (response){
                return response.data;
            });
        },
        deleteFunctionById: function(functionId){
            return $http.delete('/api/functions/' + functionId)
            .then(function (response){
                return response.data;
            });
        },
		codeConverterFn: codeConverter
	};
});