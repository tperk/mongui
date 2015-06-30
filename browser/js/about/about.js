app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope, SchemaFactory) {
    $scope.schema = SchemaFactory.schemaCreate({test: 1}, 
    {

    	//Example of how to user factory
    	//Note that the factory takes 2 parameters that are objects must pass in at least collectionName for 2nd object
    	collectionName: 'User',
    	methods: {
    		correctPassword: function (candidatePassword) {
			    return encryptPassword(candidatePassword, this.salt) === this.password;
			}
    	},
    	statics: {
    		findByTag : function(tag, cb) {
				this.find({ tags: { $elemMatch: { $eq: tag} } }, cb)
			}
    	},
    	virtuals: {
    		subtotal: function(){
			    var subtotal = 0;
			    this.all_items.forEach(function(elem){
			        subtotal += (elem.quantity * elem.art.price);
			    });
			    console.log("I REALLY HOPE THIS IS RUNNING",subtotal);
			    return subtotal;
			}
    	},
    	hooks: {
    		preSerial: {
    			save: function (next) {
				  next();
				}
    		},
    		preParallel: {
    			save: function (next, done) {
				  next();
				  doAsync(done);
				}
    		},
    		post: {
    			update: function() {
    				this.start = Date.now();
				}
    		}
    	},
    	custom: {
    		generateSalt: function () {
    		return crypto.randomBytes(16).toString('base64');
			},
			encryptPassword: function (plainText, salt) {
			    var hash = crypto.createHash('sha1');
			    hash.update(plainText);
			    hash.update(salt);
			    return hash.digest('hex');
			}
    	}
	});   
    //console.log($scope.schema);   
});