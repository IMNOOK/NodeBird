//다른 사람들이 만든 모듈
const express = require('express');

// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn, isNotLoggedIn } = require('../controllers/middlewares');
const { join, login } = require('../controllers/auth');

// routes 코드 시작 및 각종 설정
const router = express.Router();

router.post('/join',isNotLoggedIn, (req, res, next) => join(req, res, next));

router.post('/login', isNotLoggedIn, (req, res, next) => login(req, res, next));

router.get('/logout',isLoggedIn, (req, res, next) => {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

/* 카카오
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
*/
module.exports = router;