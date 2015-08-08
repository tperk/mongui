var dbURI = 'mongodb://localhost:27017/mongui_testing';
var clearDB = require('mocha-mongoose')(dbURI);

var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/db');

var Field = mongoose.model('Field');

describe('Field Schema', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Testing Schema Validation', function () {

        var createParentField = function () {
	        return Field.create({ name: 'parentField', required: true });
	    };

	    var createChildField = function (parentField) {
	        return Field.create({ name: 'childField', required: true, parents: [parentField._id] });
	    };
	    
	    it('field gets properly created', function (done) {
            createParentField().then(function (field) {              		
               	expect(field.name).to.be.equal('parentField')
	            expect(field.required).to.be.equal(true);
	            done();
           	});  
        });

		it('removes children when parent gets removed', function (done) {
             createParentField().then(function (parentField) {              		
               	createChildField(parentField).then(function (childField) {              		
               		parentField.remove()
           		})
				.then(function () {              		
           			Field.findOne({name: 'parentField'}).exec().then(function(field){
      //      				console.log('dasdmapdapsmdapsdmaspmd');
						// console.log('console log field', field);
						done()
					})

           		})




           	});  	 
        });


    });
});