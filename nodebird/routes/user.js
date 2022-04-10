//다른 사람들이 만든 모듈
const express = require('express');


// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn, isNotLoggedIn } = require('../controllers/middlewares');
const { updateProfile, following, followDelete, likeing,likeDelete } = require('../controllers/user');

// routes 코드 시작 및 각종 설정
const router = express.Router();

router.post('/profile', isLoggedIn, updateProfile);


router.post('/:id/follow', isLoggedIn, following);

router.delete('/:id/follow', isLoggedIn, followDelete);

router.post('/:id/like', isLoggedIn, likeing);

router.delete('/:id/like', isLoggedIn, likeDelete);

module.exports = router;