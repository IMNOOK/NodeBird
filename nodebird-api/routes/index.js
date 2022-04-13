const express = require('express');
const { UI, domain } = require('../controllers');
const { isLoggedIn } = require('../controllers/middlewares');

const router = express.Router();

router.get('/', UI);

router.post('/domain', isLoggedIn, domain);
	
module.exports = router;