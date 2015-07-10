app.factory('TemplateFactory', function (){
	var seedData = [];
	var seedingInfo , i, prop;	
	var faker = require('faker');
	var fakerDataObj = {
        //name
        firstName: faker.name.firstName,
        lastName: faker.name.lastName,
        findName: faker.name.findName,
        prefix: faker.name.prefix,
        suffix: faker.name.suffix,
        //address 
        zipCode: faker.address.zipCode,
        city: faker.address.city,
        cityPrefix: faker.address.cityPrefix,
        citySuffix: faker.address.citySuffix,
        streetName: faker.address.streetName,
        streetAddress: faker.address.streetAddress,
        streetSuffix: faker.address.streetSuffix,
        secondaryAddress: faker.address.secondaryAddress,
        county: faker.address.county,
        country: faker.address.country,
        state: faker.address.state,
        stateAbbr: faker.address.stateAbbr,
        latitude: faker.address.latitude,
        longitude: faker.address.longitude,
        //phone
        phoneNumber: faker.phone.phoneNumber,
        phoneNumberFormat: faker.phone.phoneNumberFormat,
        phoneFormats: faker.phone.phoneFormats,
        //internet
        avatar: faker.internet.avatar,
        email: faker.internet.email,
        userName: faker.internet.userName,
        domainName: faker.internet.domainName,
        domainSuffix: faker.internet.domainSuffix,
        domainWord: faker.internet.domainWord,
        ip: faker.internet.ip,
        userAgent: faker.internet.userAgent,
        color: faker.internet.color,
        password: faker.internet.password,
        //company
        suffixes: faker.company.suffixes,
        companyName: faker.company.companyName,
        companySuffix: faker.company.companySuffix,
        catchPhrase: faker.company.catchPhrase,
        bs: faker.company.bs,
        catchPhraseAdjective: faker.company.catchPhraseAdjective,
        catchPhraseDescriptor: faker.company.catchPhraseDescriptor,
        catchPhraseNoun: faker.company.catchPhraseNoun,
        bsAdjective: faker.company.bsAdjective,
        bsBuzz: faker.company.bsBuzz,
        bsNoun: faker.company.bsNoun,
        //image,   
        image: faker.image.image,
        avatarImage: faker.image.avatar,
        imageUrl: faker.image.imageUrl,
        abstractImage: faker.image.abstract,
        animalsImage: faker.image.animals,
        businessImage: faker.image.business,
        catsImage: faker.image.cats,
        cityImage: faker.image.city,
        foodImage: faker.image.food,
        nightlifeImage: faker.image.nightlife,
        fashionImage: faker.image.fashion,
        peopleImage: faker.image.people,
        natureImage: faker.image.nature,
        sportsImage: faker.image.sports,
        technicsImage: faker.image.technics,
        transportImage: faker.image.transport,
        //lorem
        words: faker.lorem.words,
        sentence: faker.lorem.sentence,
        sentences: faker.lorem.sentences,
        paragraph: faker.lorem.paragraph,
        paragraphs: faker.lorem.paragraphs,
        //date   
        past: faker.date.past,
        future: faker.date.future,
        between: faker.date.between,
        recent: faker.date.recent,
        //random   
        number: faker.random.number,
        array_element: faker.random.array_element,
        object_element: faker.random.object_element,
        //finance
        account: faker.finance.account,
        accountName: faker.finance.accountName,
        mask: faker.finance.mask,
        amount: faker.finance.amount,
        transactionType: faker.finance.transactionType,
        currencyCode: faker.finance.currencyCode,
        currencyName: faker.finance.currencyName,
        currencySymbol: faker.finance.currencySymbol,
        //hacker
        abbreviation: faker.hacker.abbreviation,
        adjective: faker.hacker.adjective,
        noun: faker.hacker.noun,
        verb: faker.hacker.verb,
        ingverb: faker.hacker.ingverb,
        phrase: faker.hacker.phrase,
    };

    var stringFunc = function (el, field) {
    	prop = field.seedBy[field.seedBy.type].trim();
    	el[field.name] = fakerDataObj[prop]();
    };
    var numberFunc = function (el, field) {
    	prop = field.seedBy[field.seedBy.type].trim();
		if(prop === 'number'){
			var max = 1000000;
    		var numberMax = field.typeOptions.numberMax ? field.typeOptions.numberMax: 0;
    		var numberMin = field.typeOptions.numberMin ? field.typeOptions.numberMax: 0;
    		var diff = field.typeOptions.numberMax - field.typeOptions.numberMin; 
    		if(diff !== 0) max = diff;
			el[field.name] = numberMin + fakerDataObj[prop](max);
		}else{
			el[field.name] = fakerDataObj[prop]();
		}	
    };
    var dateFunc = function (el, field) {
    	prop = field.seedBy[field.seedBy.type].trim();
    	el[field.name] = fakerDataObj[prop]();
    };
    // var bufferFunc = function (el, field) {
    // 	prop = field.seedBy[field.seedBy.type].trim();
    // 	el[field.name] = fakerDataObj[prop]();
    // };
    var booleanFunc = function (el, field) {
    	prop = field.seedBy[field.seedBy.type].trim();
    	if(prop === 'random'){
    	 	el[field.name] = fakerDataObj.number(1) ? 'true' : 'false';
    	}else el[field.name] = prop;
    };
    // var mixedFunc = function (el, field) {

    	
    // };
    var objectidFunc = function (el, field) {
		el[field.name] = require('mongoose').Types.ObjectId();
	};
    var nestedFunc = function (el, field) {
    	prop = field.seedBy[field.seedBy.type].trim();
    	el[field.name] = fakerDataObj[prop]();
    };

    function indent (str, numOfIndents) {
    	var indentString = "";
    	for(var i=0; i<numOfIndents; i++){
    		indentString = "    " + indentString;
    	}
		str = indentString + str;
		return "\n"+str;
	};

    var objectTemplate = function (arrArg){
        var str = "";
        var hasProps ;
        arrArg.forEach(function(obj){
            hasProps = false;
            str += indent("{", 2);
            for (prop in obj) {
                hasProps = true;
                if(typeof obj[prop] === "string"){//probably need to do more checking ex. date
                    str += indent(prop+": " + "'" + obj[prop] + "'" + ",", 3);
                }else{
                    str += indent(prop+": " + obj[prop] + ",", 3);
                }
            }
            if(hasProps) {
                str = str.slice(0,-1);
            }
                str += indent("},", 2);
             
        }); 
        str = str.slice(0,-1); 
        str += indent("];",1);
        return str;
    };

    var firstLetterUpperCase = function(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    var makeTemplate = function(schema, fieldsArr){
    	return indent("var mongoose = require('mongoose');", 0) +
        indent("require('../../schema_files/schemas/" + schema.name + "'" + ");", 0) +
        indent("var " + firstLetterUpperCase(schema.name) + " = mongoose.model('" + firstLetterUpperCase(schema.name) + "');", 0) +
        indent("var q = require('q');", 0) +
        indent("var seed = function () {", 0) +
        indent("var data" + " = [", 1) + 
        objectTemplate(fieldsArr) +    	
        indent("return q.invoke(" + firstLetterUpperCase(schema.name) + ", 'create', data);", 1) +
        indent("};", 0)+
        indent("module.exports = seed;", 0);
    };

	var createSeedFile = function (currentSchema, fieldsArr, field){	
		if(!field) return makeTemplate(currentSchema, fieldsArr);
		
		fieldsArr.forEach(function (el){
			if(field.seedBy.type === 'random'){				
				switch (field.fieldType) {
			    	case 'String': stringFunc(el, field)
			    		break;
			    	case 'Number': numberFunc(el, field)
			    		break;
			    	case 'Date': dateFunc(el, field)
			    		break;
			    	// case 'Buffer': bufferFunc(el, field)
			    	// 	break;
			    	case 'Boolean': booleanFunc(el, field)
			    		break;
			    	// case 'Mixed': mixedFunc(el, field)
			    	// 	break;
			    	case 'Objectid': objectidFunc(el, field)
			    		break;
			    	case 'Nested': nestedFunc(el, field)
			    		break;
		    	}
			}
			// else if(field.seedBy.type === 'schema'){

			// }
			else {
				el[field.name] = field.seedBy[field.seedBy.type];
			}	
		});
		return makeTemplate(currentSchema, fieldsArr);
	};

    var requireTemplate = function (schemas) {
        var str = "";
        schemas.forEach(function(schema){
            str += indent("var " + schema.name + " = require('./files/"+schema.name+"');", 0);
        });
        return str;
    };

    var schemaArrTemplate = function (schemas) {
        var str = "\nvar schemaArr = [";
        schemas.forEach(function(schema){
            str += schema.name + ", ";
        });
        str = str.slice(0,-2);
        str += "];"
        return str;
    }

    var createSeedIndexJS = function(projectName, schemas){
        var projectName = projectName;
        var schemaNamesArr = schemas;

        var str = "var Q = require('q');" +
        indent("var path = require('path');", 0) +
        indent("var DATABASE_URI = 'mongodb://localhost:27017/" + projectName + "';", 0) +
        indent("var mongoose = require('mongoose');", 0) +
        indent("var db = mongoose.connect(DATABASE_URI).connection;", 0) +
        "\n" +
        indent("var startDbPromise = new Q(function (resolve, reject) {", 0) +
        indent("db.on('open', resolve);", 1) +
        indent("db.on('error', reject);", 1) +
        indent("});", 0) +
        "\n" +
        requireTemplate(schemaNamesArr) +
        "\n" +
        schemaArrTemplate(schemaNamesArr) +
        "\n" +
        indent("startDbPromise.then(function (resolve, reject) {", 0) +
        indent("var promiseArr = [];", 1) +
        indent("schemaArr.forEach(function(func){", 1) +
        indent("promiseArr.push(func());", 2) +
        indent("});", 1) +
        indent("Q.all(promiseArr)", 1) +
        indent(".then(function(){", 1) +
        indent(" process.kill(0);", 2) +
        indent("});", 1) +
        indent("});", 0)
        return str;
    };

	return {
		createSeedFile: createSeedFile,
        indent: indent,
        createSeedIndexJS: createSeedIndexJS
	};
});