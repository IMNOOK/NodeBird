//다른 사람들이 만든 모듈
const express = require('express');

// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn, isNotLoggedIn } = require('../controllers/middlewares');
const { UI, getMain, getHashtag } = require('../controllers/page');

// routes 코드 시작 및 각종 설정
const router = express.Router();

//사용자에게 보여줄 자료들을 DB에서 끌어옴
//post처럼 모든 자료를 끌고 오는 것이 아니라 각각의 개인 유저의 필요한 정보만 가져옴

//로그인 시 req.user로 부터 렌더링 값 설정
router.use((req, res, next) => UI(req, res, next));

router.get('/profile', isLoggedIn, (req, res) => {
	return res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
	return res.render('join', {title: '회원가입 - NodeBird' });
});

//메인 홈페이지: 모든 게시판 열람
router.get('/', (req, res, next) => getMain(req, res, next));

//메인 홈페이지: 해당 해쉬태그 게시판 열람
router.get('/hashtag', (req, res, next) => getHashtag(req, res, next));

module.exports = router;