var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose')
//var models = require('../../../server/db')



// var projects = request(require('../../../server/app/routes/projects/index.js'));
var app = require('../../../server/app')

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var User = mongoose.model('User')
var Project = mongoose.model('Project')
var Schema = mongoose.model('Schema')

describe('Project routes', function () {
	
	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('get requests', function () {
		
		it('returns the populated projects for a user', function (done) {	
			Project.create({
				name: "test project"
			}).then(function (project){
				User.create({
					firstName: 'James',
					projects: [project._id],
					pendingProjects: []
				}).then(function (user) {
					request(app)
					.get('/api/projects/' + user._id)
					.expect(200, function (req, res) {
						expect(res.body[0].name).to.be.equal("test project")
						done()
					})
				})
			})
		})

		it('returns the pending projects for a user', function (done) {	
			Project.create({
				name: "test pending"
			}).then(function (project){
				User.create({
					firstName: 'James',
					projects: [],
					pendingProjects: [project._id]
				}).then(function (user) {
					request(app)
					.get('/api/projects/pending/' + user._id)
					.expect(200, function (req, res) {
						expect(res.body[0].name).to.be.equal("test pending")
						done()
					})
				})
			})
		})

		it('returns the schemas for a user', function (done) {	
			Schema.create({
				name: "test schema"
			}).then(function (schema){
				Project.create({
					schemas: [schema._id]
				}).then(function (project) {
					request(app)
					.get('/api/projects/schemas/' + project._id)
					.expect(200, function (req, res) {
						expect(res.body[0].name).to.be.equal("test schema")
						done()
					})
				})
			})
		})

		it('returns the current project', function (done) {	
			Project.create({
				name: "test project"
			}).then(function (project) {
				request(app)
				.get('/api/projects/current/' + project._id)
				.expect(200, function (req, res) {
					expect(res.body.name).to.be.equal("test project")
					done()
				})
			})
		})

	})

	describe('post requests', function () {

		it('creates a project for a user', function (done) {
			User.create({
				firstName: "Obama"
			}).then(function (user) {
				request(app)
				.post('/api/projects/' + user._id)
				.expect(200, function (req, res) {
					expect(res.body.firstName).to.be.equal('Obama')
					expect(res.body.projects.length).to.not.equal(0)
					done()
				})
			})
		})

	})

	describe('put requests', function () {

		it('updates the body of a project', function (done) {
			Project.create({
				name: "test project 1"
			}).then(function (project) {
				request(app)
				.put('/api/projects/' + project._id)
				.send({name: "test project 2"})
				.expect(200, function (req, res) {
					expect(res.body).to.be.equal("updated")
					request(app)
					.get('/api/projects/current/' + project._id)
					.expect(200, function (req, res) {
						expect(res.body.name).to.be.equal("test project 2")
						done()
					})
				})
			})
		})

		it('moves a pending project to a current project', function (done) {
			Project.create({

			}).then(function (project) {
				User.create({
					projects: [],
					pendingProjects: [project._id]
				}).then(function (user) {
					request(app)
					.put('/api/projects/pending/' + user._id + '/' + project._id)
					.expect(200, function (req, res) {
						expect(res.body.projects[0]).to.be.equal(String(project._id))
						expect(res.body.pendingProjects.length).to.be.equal(0)
						done()
					})
				})
			})
		})
	})

	describe('delete requests', function () {

		it('deletes a pending project from a user', function (done) {
			Project.create({

			}).then(function (project) {
				User.create({
					projects: [],
					pendingProjects: [project._id]
				}).then(function (user) {
					request(app)
					.delete('/api/projects/pending/' + user._id + '/' + project._id)
					.expect(200, function (req, res) {
						expect(res.body.pendingProjects.length).to.be.equal(0)
						done()
					})
				})
			})
		})
	})

})

// mongoose.connection.close()