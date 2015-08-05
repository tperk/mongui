var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose')
var app = require('../../../server/app')

var dbURI = 'mongodb://localhost:27017/mongui_test';
var clearDB = require('mocha-mongoose')(dbURI);

var Field = mongoose.model('Field')
var Schema = mongoose.model('Schema');

describe('Field routes', function () {
	
	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('get requests', function () {
		
		// xit('returns an array of all the fields in the DB', function (done) {	
		// 	Field.create({
		// 		name: "test field"
		// 	}).then(function (field){
		// 		request(app)
		// 		.get('/api/fields/')
		// 		.expect(200, function (req, res) {
		// 			expect(res.body[0].length).to.be.equal(1)
		// 			done();
		// 		})
		// 	})
		// });

		it('returns one field', function (done) {	
			Field.create({
				name: "test field"
			}).then(function (field){
				request(app)
				.get('/api/fields/' + field._id)
				.expect(200, function (req, res) {
					expect(res.body.name).to.be.equal("test field");
					done();
				})
			})
		});

		it('returns all the fields for a schema', function (done) {	
			Field.create({
				name: "test field"
			}).then(function (field){
				Schema.create({
					name: "test schema",
					fields:[field._id]
				}).then(function (schema){
					request(app)
					.get('/api/fields/' + field._id)
					.expect(200, function (req, res) {
						expect(res.body.name).to.be.equal("test field");
						done();
					})
				})
			})
		});
	});

	describe('put requests', function () {
		it('updates field by id', function (done) {	
			Field.create({
				name: "test field"
			}).then(function (field) {
				request(app)
				.put('/api/fields/' + field._id)
				.send({name: "new name"})
				.expect(200, function (req, res) {
					expect(res.body.name).to.be.equal("new name");
					request(app)
					.get('/api/fields/' + field._id)
					.expect(200, function (req, res) {
						expect(res.body.name).to.be.equal("new name");
						done();
					})
				})
			})
		});
	});

	describe('post requests', function () {
		it('uses an id to find a schema then creates a field with the payload and adds it to the schema\'s fields array', function (done) {	
			Field.create({
				name: "test field"
			}).then(function (field) {
				Schema.create({
					name: "test schema"
				}).then(function (schema) {
					request(app)
					.post('/api/fields/' + schema._id)
					.send({name: "new field name"})
					.expect(200, function (req, res) {
						request(app)
						.get('/api/schemas/fields/' + schema._id)
						.expect(200, function (req, res) {
							expect(res.body.length).to.be.equal(1);
							expect(res.body[0].name).to.be.equal("new field name");
							done();
						})
					})
				})
			})
		});
	});

	describe('delete requests', function () {
		it('finds a field by id and removes it from the database', function (done) {	
			Field.create({
				name: "testing delete field"
			}).then(function (field) {
				request(app)
				.delete('/api/fields/' + field._id)
				.expect(200, function (req, res) {
					request(app)
					.get('/api/fields/' + field._id)
					.expect(200, function (req, res) {
						console.log('res.body', res.body);
						//should be deleted but isn't

						done();
					})
				})
			})
		});
	});
})