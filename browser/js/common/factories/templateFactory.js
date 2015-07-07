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

    function indent(str, numOfIndents) {
    	var indentString = "";
    	for(var i=0; i<numOfIndents; i++){
    		indentString = "    " + indentString;
    	}
		str = indentString + str;
		return "\n"+str;
	};

    var makeTemplate = function(schema, fieldsArr){
    	return "var " + schema.name  + " = " + JSON.stringify(fieldsArr, null, 4).replace(/\"([^(\")"]+)\":/g,"$1:") + ";" +
    	indent("var bluebird = require('bluebird');", 0) + 
    	indent("var mongoose = require('mongoose');", 0) + 
    	"\n" +
    	indent("var " + schema.name + "Model = require('')//add path to model here!;", 0) +
    	indent("mongoose.connect('mongodb://localhost/'" + schema.name + ");", 0) +
    	"\n" +
    	indent("var wipeDB = function () {", 0) + 
    	indent("var models = [", 1) + schema.name + "Model];" +
    	indent("models.forEach(function (model) {", 1) + 
    	indent("model.find({}).remove(function () {});", 2) + 
    	indent("});", 1) +
    	indent("return bluebird.resolve();", 1) + 
		indent("};", 0) +
    	"\n" +
    	indent("var seed = function () {", 0) +
    	indent(schema.name + "Model.create(" + schema.name + ", function (err) {", 1) +
    	indent("if (err) { console.error(err);};", 2) + 
    	indent("process.kill(0);", 2) + 
    	indent("});", 1) + 
    	indent("};", 0) + 
		"\n" +
		indent("mongoose.connection.once('open', function () {", 0) + 
		indent("wipeDB().then(seed);", 1) + 
		indent("});", 0);
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
			    	case 'Mixed': mixedFunc(el, field)
			    		break;
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

	return {
		createSeedFile: createSeedFile
	};
});