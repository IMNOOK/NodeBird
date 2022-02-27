//다른 사람들이 만든 모듈
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn, isNotLoggedIn, con } = require('./middlewares');

// routes 코드 시작 및 각종 설정
const router = express.Router();

router.post('/join',isNotLoggedIn, async (req, res, next) => {
	const { email, nick, password } = req.body;
	try{
		const [rows, fields] = await con.query(`SELECT * FROM User WHERE email = ?`,email);
		if(rows.length != 0) {
			return res.redirect('/join?error=exist');
		} 
		const hash = await bcrypt.hash(password, 12);
		await con.query(`INSERT INTO User(email, nick, password) VALUES (?, ?, ?);`,[email, nick, hash]);
		return res.redirect('/');
		
	} catch (error){
		console.error(error);
		return next(error);
	}	
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
	passport.authenticate('local', (authError, user, info) => {
		if (authError) {
			console.error(authError);
			return next(authError);
		}
		if(!user) {
			return res.redirect(`/?loginError=${info.message}`);
		}
		return req.login(user, (loginError) => {
			if (loginError) {
				console.error(loginError);
				return next(loginError);
			}
			return res.redirect('/');
		});
	})(req, res, next); // 미들웨어 내의 미들웨어는 (req, res, next)를 붙인다.
});

router.get('/logout',isLoggedIn, (req, res, next) => {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

router.get('/kakao',isNotLoggedIn, (req, res, next) => {
	try{
		
	} catch (error){
		console.error(error);
		next(error);
	}	
});

router.get('/kakao/callback',isNotLoggedIn, (req, res, next) => {
	try{
		
	} catch (error){
		console.error(error);
		next(error);
	}	
});

module.exports = router;