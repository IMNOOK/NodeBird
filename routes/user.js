//다른 사람들이 만든 모듈
const express = require('express');
const bcrypt = require('bcrypt');

// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn, isNotLoggedIn, con } = require('./middlewares');

// routes 코드 시작 및 각종 설정
const router = express.Router();

router.post('/profile', isLoggedIn, async (req, res, next) => {
	try{
		const { nick, password } = req.body;
		const hash = await bcrypt.hash(password, 12);
		await con.query('UPDATE User SET nick = ?, password = ? WHERE id = ?', [nick,hash,req.user.id]);
	} catch(error){
		console.error(error);
		next(error);
	}
	return res.redirect('/');
});


router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
	const follower = req.params.id;
	try{
		let [rows, fields] = await con.query('SELECT * FROM Follow WHERE followingId = ? AND followerId = ?',[req.user.id, follower]);
		if(rows.length == 0){
			await con.query('INSERT INTO Follow (followingId, followerId) VALUES(?,?)', [req.user.id, follower]);
		}
	} catch(error){
		console.error(error);
		next(error);
	}
	return res.render('profile', { title: '내 정보 - NodeBird' });
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
	const following = req.params.id;
	try{
		let [rows, fields] = await con.query('SELECT * FROM Follow WHERE followingId = ? AND followerId = ?',[req.user.id, following]);
		if(rows.length != 0){
			await con.query('DELETE FROM Follow WHERE followingId = ? AND followerId = ?', [req.user.id, following]);
		}
	} catch(error){
		console.error(error);
		next(error);
	}
	return res.render('profile', { title: '내 정보 - NodeBird' });
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
	const postid = req.params.id;
	try{
		let [rows, fields] = await con.query('SELECT * FROM Good WHERE userId = ? AND postId = ?',[req.user.id, postid]);
		if(rows.length == 0){
			await con.query('INSERT INTO Good (userId, postId) VALUES (?,?)', [req.user.id, postid]);
		}
	} catch(error){
		console.error(error);
		next(error);
	}
	return res.redirect('/');
});

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
	const postid = req.params.id;
	try{
		let [rows, fields] = await con.query('SELECT * FROM Good WHERE userId = ? AND postId = ?',[req.user.id, postid]);
		if(rows.length != 0){
			await con.query('DELETE FROM Good WHERE postId = ? AND userId = ?', [postid, req.user.id]);
		}
	} catch(error){
		console.error(error);
		next(error);
	} 
	return res.render('main', {
			title: 'NodeBird'
		});
});
module.exports = router;