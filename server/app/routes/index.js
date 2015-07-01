'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/register', require('./apis/subroutes/register.js'));
router.use('/projects', require('./apis/subroutes/projects.js'));
router.use('/fields', require('./fields'));
router.use('/project', require('./apis/subroutes/project.js'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});