const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, apiLimiter, con } = require('./middlewares');

const router = express.Router();

router.use(apiLimiter);

router.post('/token', apiLimiter, async (req, res) => {
	const {clientSecret} = req.body;
	try{
		let [ rows, fields ] = await con.query('SELECT User.id, User.nick FROM Domain JOIN User ON Domain.userid = User.id WHERE clientSecret = ?' ,clientSecret);
		const domain = rows[0];
		if(domain.length == 0) {
			return res.status(401).json({
				code: 401,
				message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요'
			});
		}
		const token = jwt.sign({
			id: domain.id,
			nick: domain.nick,
		}, process.env.JWT_SECRET, {
			expiresIn: '30m', //30분	
		});
		return res.status(200).json({
			code: 200,
			message: '토큰이 발급되었습니다',
			token,
		})
	} catch(error){
		console.error(error);
		return res.status(500).json({
			code: 500,
			message: '서버 에러',
		});
	}
});

router.get('/tes', verifyToken, apiLimiter, (req, res) => {
	res.json(req.decode);
});

router.get('/posts/my', apiLimiter, verifyToken, async (req, res) => {
	try{
		let [rows, fields] = await con.query('SELECT * FROM Post WHERE contenter = ?' ,req.decoded.id);
		const posts = rows;
		console.log(posts);
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
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
	try{
		let [rows, fields] = await con.query('SELECT * FROM Hashtag WHERE title = ?', req.params.title);
		const hashtag = rows[0];
		if(hashtag.length == 0){
			return res.status(404).json({
				code: 404,
				message: '검색 결과가 없습니다'
			});
		}
		[rows, fields] = await con.query('SELECT * FROM Post JOIN PostHashtag ON Post.id = PostHashtag.postId WHERE PostHashtag.hashtagId = ?', hashtag.id);
		const posts = rows;
		console.log(posts);
		return res.json({
			code: 200,
			payload: posts,
		});
	} catch(error){
		console.error(error);
		return res.status(500).json({
			code: 500,
			message: '서버 에러',
		})
	}
})