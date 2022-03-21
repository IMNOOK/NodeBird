const express = require('express');
const { main, domain } = require('../controllers');

const router = express.Router();

router.get('/', async ( req, res, next) => main(req, res, next));


router.post('/domain', isLoggedIn, async (req, res, next) => domain(req, res, next));
	
module.exports = router;