'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    salt: String,
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    pendingProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }
    next();
});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

schema.pre('remove', function (next){
    if(this.projects.length > 0){
        this.populate('projects', function(err, parent){
            for(var i = 0; i < parent.projects.length; i++){
                parent.projects[i].remove();
            }
        });
    }
    next();
});

mongoose.model('User', schema);