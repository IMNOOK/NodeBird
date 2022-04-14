const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { con } = require('./middlewares');



exports.cors = async (req, res, next) => {
	const host = url.parse(req.get('origin')).host
	console.log(host);
	let [rows, fields] = await con.query('SELECT * FROM Domain WHERE host = ?', host);
	console.log(rows);
	if(rows.length != 0) {
		cors({
			origin: req.get('origin'),
			credentials: true,
		})(req, res, next);
	} else {
		next();
	}
};

exports.token = async (req, res) => {
	const {clientSecret} = req.body;
	try{
		let [rows, fields] = await con.query(`SELECT * FROM Domain JOIN User ON Domain.userId = User.id WHERE Domain.clientSecret = ?`, clientSecret);
		const domain = rows[0];
		if(domain == undefined) {
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
};

exports.myPosts = async (req, res) => {
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
}

exports.hashtagPosts = async (req, res) => {
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
}