//다른 사람들이 만든 모듈
const express = require('express');
// 내가 만든 모듈 or 미리 설정한 값 가져옴 

// routes 코드 시작 및 각종 설정
const { isLoggedIn, isNotLoggedIn, con } = require('./middlewares');

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

router.get('/', async (req, res, next) => {
	try{
		
		let [rows, fields] = await con.query('SELECT * FROM Post');
		const posts = rows;
		// .map 메소드에서 await을 사용하기 위해선 Promise.all을 사용해야 함.
		await Promise.all(posts.map(async (post) => {
			[rows, fields] = await con.query('SELECT * FROM Good WHERE postId = ?', post.id);
			post.LikeCount = rows.length;
			return post;
		}));
		
		return res.render('main', {
			title: 'NodeBird',
			twits: posts,
		});
	} catch (error){
		console.error(error);
		return next(error);
	}
});

router.get('/hashtag', async (req, res, next) => {
	const { hashtag } = req.query;
	try{
		let [rows, field] = await con.query('SELECT id FROM Hashtag WHERE title = ?', hashtag);
		if(rows.length != 0){
			const hashtagId = rows[0].id;
			[ rows, field] = await con.query('SELECT Post.id, Post.contenter, Post.content, Post.img FROM PostHashtag JOIN Post ON Post.id = PostHashtag.postId WHERE PostHashtag.hashtagId = ?' ,hashtagId);	
		} else{
			[rows, field] = await con.query('SELECT * FROM Post');
		}
		const posts = rows;
		return res.render('main', {
			title: 'NodeBird',
			twits: posts,
		});
	} catch (error){
		console.error(error);
		return next(error);
	}	
})

module.exports = router;