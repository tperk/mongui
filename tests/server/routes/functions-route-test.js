var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose')
var app = require('../../../server/app')

var dbURI = 'mongodb://localhost:27017/mongui_testing';
var clearDB = require('mocha-mongoose')(dbURI);

var Func = mongoose.model('Func')
var Schema = mongoose.model('Schema');

describe('Function routes', function () {
	
	function isObj(x){
		if (typeof x === "object") return true;
		else return false;
	};

	function isEmptyObj(obj){
		var prop;
		for (prop in obj) {
			if (Object.hasOwnProperty.call(obj, prop)) {
				return false;
			}
		}
		return true;
	};


	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('get requests', function () {
		
		it('returns one function', function (done) {	
			Func.create({
				name: "test function"
			}).then(function (func){
				request(app)
				.get('/api/functions/' + func._id)
				.expect(200, function (req, res) {
					expect(res.body.name).to.be.equal("test function");
					done();
				})
			})
		});

		it('returns all the functions for a schema', function (done) {	
			Func.create({
				name: "test function"
			}).then(function (func){
				Schema.create({
					name: "test schema",
					functions:[func._id]
				}).then(function (schema){
					request(app)
					.get('/api/functions/' + func._id)
					.expect(200, function (req, res) {
						expect(res.body.name).to.be.equal("test function");
						done();
					})
				})
			})
		});
	});

	describe('put requests', function () {
		it('updates function by id', function (done) {		
			Func.create({
				name: "test function"
			}).then(function (func) {
				request(app)
				.put('/api/functions/' + func._id)
				.send({name: "new function name"})
				.expect(200, function (req, res) {
					expect(res.body.name).to.be.equal("new function name");
					request(app)
					.get('/api/functions/' + func._id)
					.expect(200, function (req, res) {
						expect(res.body.name).to.be.equal("new function name");
						done();
					})
				})
			})
		});
	});

	describe('post requests', function () {
		it('uses an id to find a schema then creates a function with the payload and adds it to the schema\'s funcs array', function (done) {	
			Func.create({
				name: "test function"
			}).then(function (func) {
				Schema.create({
					name: "test schema"
				}).then(function (schema) {
					request(app)
					.post('/api/functions/' + schema._id)
					.send({name: "new function name"})
					.expect(200, function (req, res) {
						request(app)
						.get('/api/schemas/functions/' + schema._id)
						.expect(200, function (req, res) {
							expect(res.body.length).to.be.equal(1);
							expect(res.body[0].name).to.be.equal("new function name");
							done();
						})
					})
				})
			})
		});
	});

	describe('delete requests', function () {
		it('finds a function by id and removes it from the database', function (done) {	
			Func.create({
				name: "testing delete function"
			}).then(function (func) {
				request(app)
				.delete('/api/functions/' + func._id)
				.expect(200, function (req, res) {
					request(app)
					.get('/api/functions/' + func._id)
					.expect(200, function (req, res) {
						expect(isObj(res.body)).to.be.equal(true);
						expect(isEmptyObj(res.body)).to.be.equal(true);
						done();
					})
				})
			})
		});
	});
});
