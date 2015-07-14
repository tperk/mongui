/*
    These environment variables are not hardcoded so as not to put
    production information in a repo. They should be set in your
    heroku (or whatever VPS used) configuration to be set in the
    applications environment, along with NODE_ENV=production

 */

module.exports = {
    "DATABASE_URI": process.env.MONGOLAB_URI,
    "SESSION_SECRET": process.env.SESSION_SECRET,
    "TWITTER": {
        "consumerKey": process.env.TWITTER_CONSUMER_KEY,
        "consumerSecret": process.env.TWITTER_CONSUMER_SECRET,
        "callbackUrl": process.env.TWITTER_CALLBACK
    },
    "FACEBOOK": {
        "clientID": "503429563144362",
        "clientSecret": "b33f58d664c7ad0613ef0a9ee00bbc56",
        "callbackURL": "https://www.mongui.io/auth/facebook/callback"
    },
    "GOOGLE": {
        "clientID": "435571589713-i4qvulmk5tvf0l73h57t68gopoj0l7j4.apps.googleusercontent.com",
        "clientSecret": "lu6eCLQ2Z7mgOCLxgLjn7_8u",
        "callbackURL": "https://www.mongui.io/auth/google/callback"
    }
};