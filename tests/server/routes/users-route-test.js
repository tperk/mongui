var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose')
// var models = require('../../../server/db')
var app = require('../../../server/app')

var dbURI = 'mongodb://localhost:27017/mongui_testing';
var clearDB = require('mocha-mongoose')(dbURI);

var Project = mongoose.model('Project')
var Schema = mongoose.model('Schema')
var Field = mongoose.model('Field')
var Func = mongoose.model('Func')

describe('Schema routes', function () {
	
	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('get requests', function () {
		
		it('returns project members', function (done) {	
			Schema.create({
				name: "test schema"
			}).then(function (schema){	
				request(app)
				.get('/api/schemas/' + schema._id)
				.expect(200, function (req, res) {
					expect(res.body.name).to.be.equal("test schema")
					done()
				})
			})
		})

		it('returns all the user emails', function (done) {	
			Field.create({
				name: "test field"
			}).then(function (field){
				Schema.create({
					fields: [field._id]
				}).then(function (schema) {
					request(app)
					.get('/api/schemas/fields/' + schema._id)
					.expect(200, function (req, res) {
						expect(res.body[0].name).to.be.equal("test field")
						done()
					})
				})
			})
		})

	})

	describe('post requests', function () {

		it('adds a project to a user', function (done) {
			Project.create({
				name: "my project"
			}).then(function (project) {
				request(app)
				.post('/api/schemas/' + project._id)
				.send({
					name: "test schema"
				})
				.expect(200, function (req, res) {
					expect(res.body.name).to.be.equal('my project')
					request(app)
					.get('/api/schemas/' + res.body.schemas[0])
					.expect(200, function (req, res) {
						expect(res.body.name).to.be.equal("test schema")
						done()
					})
				})
			})
		})

	})

})

// mongoose.connection.close()