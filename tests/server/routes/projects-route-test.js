var expect = require('chai').expect;
var supertest = require('supertest');
var app = supertest(require('../../server/main.js'));