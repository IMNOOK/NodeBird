const passport = require('passport');
const bcrypt = require('bcrypt');

const { item } = require('../models/item');

exports.join = async (req, res, next) => {
	const { email, nick, password } = req.body;
	try{
		const hash = await bcrypt.hash(password, 12);
		if( item.User.setUser(email, nick, hash) == 0) {
			return res.redirect('/join?error=exist');
		}
		return res.redirect('/');
	} catch(error) {
		console.error(error);
		return next(error);
	}
};

exports.login = async (req, res, next) => {
	passport.authenticate('local', (authError, user, info) => {
		if (authError) {
			console.error(authError);
			return next(authError);
		}
		if (!user) {
			return res.redirect('/')
		}
		return req.login(user, (loginError) => {
			if(loginError) {
				console.error(loginError);
				return next(loginError);
			}
			return res.redirect('/');
		});
	})(req, res, next); //미들웨어 내의 미들웨어는 (req, res, next)를 붙여서 인수를 줘야 한다!!
};