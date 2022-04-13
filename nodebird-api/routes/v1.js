const express = require('express');
const jwt =  require('jsonwebtoken');

const { verifyToken, con, deprecated } = require('../controllers/middlewares');

const router = express.Router();

router.use(deprecated);


//deprecated
router.post('/token', async (req, res) => {
	const { clientSecret } = req.body;
	try{
		let [rows, fields] = await con.query('SELECT User.id, User.nick FROM Domain JOIN User ON Domain.userId = User.id  WHERE clientSecret = ?' ,clientSecret);
		const domain = rows[0];
		console.log(domain);
		if(!domain) {
			return res.status(401).json({
				code: 401,
				message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요'
			});
		}
		const token = jwt.sign({
			id: domain.id,
			nick: domain.nick,
		}, process.env.JWT_SECRET, {
			expiresIn: '1m', // 유효 기간 1분
		});
		return res.json({
			code: 200,
			message: '토큰이 발급되었습니다',
			token,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			code: 500,
			message: '서버 에러',
		});
	}
});

router.get('/test', verifyToken, (req, res) => {
	res.json(req.decoded);
});

router.get('/posts/my', verifyToken, async (req, res,) =>  {
	try{
		let [rows, fields] = await con.query('SELECT * FROM Post WHERE contenter = ?' ,req.decoded.id);
		console.log(rows);
		const posts = rows;
		res.json({
			code: 200,
			payload: posts,
		});
	} catch(error){
		console.error(error);
		return res.status(500).json({
			code: 500,
			message: '서버 에러',
		});
	}
})

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
	try{
		let [rows, fields] = await con.query('SELECT * FROM Hashtag WHERE title = ?', req.params.title);
		const hashtag = rows[0];
		console.log(hashtag);
		if(hashtag.length == 0){
			return res.status(404).json({
				code: 404,
				message: '검색 결과가 없습니다',
			});
		}
		[rows, fields] = await con.query('SELECT * FROM Post JOIN PostHashtag ON Post.id = PostHashtag.postId WHERE PostHashtag.hashtagId = ?', hashtag.id);
		const posts = rows;
		console.log(posts);
		return res.json({
			code: 200,
			payload: posts,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			code: 500,
			message: '서버 에러',
		});
	}
});

module.exports = router;