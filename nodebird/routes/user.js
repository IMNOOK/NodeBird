//다른 사람들이 만든 모듈
const express = require('express');


// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn, isNotLoggedIn } = require('../controllers/middlewares');
const { updateProfile, following, followDelete, likeing,likeDelete } = require('../controllers/user');

// routes 코드 시작 및 각종 설정
const router = express.Router();

router.post('/profile', isLoggedIn, (req, res, next) => updateProfile(req, res, next));


router.post('/:id/follow', isLoggedIn, (req, res, next) => following(req, res, next));

router.delete('/:id/follow', isLoggedIn, (req, res, next) => followDelete(req, res, next));

router.post('/:id/like', isLoggedIn, (req, res, next) => likeing(req, res, next));

router.delete('/:id/like', isLoggedIn, (req, res, next) => likeDelete(req, res, next));

module.exports = router;