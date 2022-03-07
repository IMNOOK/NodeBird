const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'https://imnook-develop.run.goorm.io/v2';
axios.defaults.headers.origin = 'https://imnook-nodecat.run.goorm.io';
const request = async (req, api) => {
	try {
		if (!req.session.jwt) { // 세션에 토큰이 없으면 토큰 발급 시도
			const tokenResult = await axios.post(`${URL}/token`, {
				clientSecret: process.env.CLIENT_SECRET,
			});
			req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
		}
		return await axios.get(`${URL}${api}`, {
			headers: { authorization: req.session.jwt},
		}); // API 요청
	} catch (error) {
    	if (error.response.status === 419) { // 토큰 만료 시
			delete req.session.jwt;
			return request(req, api);
		} // 419 만료 이외에 에러
		return error.response;
	}
};

router.get('/mypost', async (req, res, next) => {
	try{
		const result = await request(req, '/posts/my');
		res.json(result.data);
	} catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/search/:hashtag', async (req, res, next) => {
	try{
		const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
		res.json(result.data);
	} catch(error){
		console.error(error);
		next(error);
	}
});

module.exports = router;