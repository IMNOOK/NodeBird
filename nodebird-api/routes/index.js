const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { isLoggedIn, con } = require('./middlewares');

const router = express.Router();

router.get('/', async ( req, res, next) => {
	try{
		let user;
		let domains;
		if(req.isAuthenticated()){
			let [ rows, fields ] = await con.query('SELECT * FROM User WHERE id = ?', req.user.id);
			user = rows[0];
			[ rows, fields ] = await con.query('SELECT * FROM Domain WHERE userId = ?', req.user.id);
			domains = rows;
		}
		res.render('login', {
			user,
			domains,
		});
	} catch(error) {
		console.error(error);
		next(error);
	}
});


router.post('/domain', isLoggedIn, async (req, res, next) => {
	try{
		await con.query('INSERT INTO Domain(userId, host, type, clientSecret) VALUES (?,?,?,?)', [req.user.id, req.body.host, req.body.type, uuidv4()]);
		res.redirect('/');
	} catch(error) {
		console.error(error);
		next(error);
	}
});
	
module.exports = router;