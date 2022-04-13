const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

//DB
exports.con = pool.promise();


//Loggin
exports.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
		next();
	} else {
		res.status(403).send('로그인 필요');
	}
};
	  
exports.isNotLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()){
		next();
	} else {
		const message = encodeURIComponent('로그인한 상태입니다.');
		res.redirect(`/?error=${message}`);
	}
};

exports.verifyToken = (req, res, next) => {
	try{
		req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
		return next();
	} catch(error) {
		if(error.name === 'TokenExpiredError') { // 유효 기간 초과
			return res.status(419).json({
				code: 419,
				message: '토큰이 만료되었습니다',
			});
		}
		return res.status(401).json({
			code: 401,
			message: '유효하지 않은 토큰입니다',
		});
	}
};

exports.apiLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	handler(req, res) {
		res.status(this.statusCode).json({
			code: this.statusCode, //기본값 429
			message: '1분에 10번만 요청할 수 있습니다.'
		});
	}
});

exports.deprecated = (req, res) => {
	res.status(410).json({
		code: 410,
		message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
	});
};