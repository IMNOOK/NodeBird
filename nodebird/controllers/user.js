const bcrypt = require('bcrypt');

const { con } = require('./db');
const {UserCache} = require('../passport');

exports.updateProfile = async (req, res, next) => {
	try{
		const { nick, password } = req.body;
		const hash = await bcrypt.hash(password, 12);
		await con.query('UPDATE User SET nick = ? , password = ? WHERE id = ?', [nick, hash, req.user.id]);
		return res.redirect('/');
	} catch(error) {
		console.error(error);
		next(error);
	}
};

exports.following = async (req, res, next) => {
	const follower = req.params.id;
	try{
		await con.query('INSERT INTO Follow(followingId, followerId) SELECT ?,? FROM DUAL WHERE NOT EXISTS (SELECT * FROM Follow WHERE followingId = ? AND followerId = ?)',[req.user.id, follower, req.user.id, follower]);
		UserCache[req.user.id].Status = 1;
		return res.redirect('/');
	} catch(error){
		console.error(error);
		next(error);
	}
}

	
exports.followDelete = async (req, res, next) => {
	const follower = req.params.id;
	try{
		console.log("DELETE START");
		await con.query('DELETE FROM Follow WHERE followingId = ? AND followerId = ?', [req.user.id, follower]);
		UserCache[req.user.id].Status = 1;
    	return res.send("DELETE succese");
	} catch(error) {
		console.error(error);
		next(error);
	}
}

exports.likeing = async (req, res, next) => {
	const postid = req.params.id;
	try{
		await con.query('INSERT INTO Good (userId, postId) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM Good WHERE userId = ? AND postId = ?)', [req.user.id, postid, req.user.id, postid]);
		UserCache[req.user.id].Status = 2;
		return res.redirect('/');
	} catch(error) {
		console.error(error);
		next(error);
	}
}

exports.likeDelete = async (req, res, next) => {
	const postid = req.params.id;
	try{
		await con.query('DELETE FROM Good WHERE userId = ? AND postId = ?', [req.user.id, postid]);
		UserCache[req.user.id].Status = 2;
    	return res.send("DELETE succese");
	} catch(error) {
		console.error(error);
		next(error);
	}
}