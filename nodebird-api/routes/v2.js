const express = require('express');

const { cors, token, myPosts, hashtagPosts } = require('../controllers/v2');
const { verifyToken, apiLimiter, con } = require('../controllers/middlewares');

const router = express.Router();


router.use(cors);

router.post('/token', apiLimiter, token);

router.get('/test', verifyToken, apiLimiter, (req, res) => {
	res.json(req.decode);
});

router.get('/posts/my', apiLimiter, verifyToken, myPosts);

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, hashtagPosts)

module.exports = router;