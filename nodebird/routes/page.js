//다른 사람들이 만든 모듈
const express = require('express');

// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { getMain, getHashtag } = require('../controllers/page');

// routes 코드 시작 및 각종 설정
const router = express.Router();

//사용자에게 보여줄 자료들을 DB에서 끌어옴
//post처럼 모든 자료를 끌고 오는 것이 아니라 각각의 개인 유저의 필요한 정보만 가져옴
router.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.followerCount = req.user ? req.user.Followers.length : 0;
	res.locals.followingCount = req.user ? req.user.Followings.length : 0;
	res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.followerId) : [];
	res.locals.goodPostIdList = req.user ? req.user.GoodPostId.map(u => u.postId) : [];
	next();
});

router.get('/profile', isLoggedIn, (req, res) => {
	return res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
	return res.render('join', {title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => getMain(req, res, next));

router.get('/hashtag', (req, res, next) => getHashtag(req, res, next));

module.exports = router;