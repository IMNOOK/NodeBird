const bcrypt = require('bcrypt');

const { item } = require('../models/item.js');
const {UserCache} = require('../passport');

exports.updateProfile = async (req, res, next) => {
	const { nick, password } = req.body;
	try{
		const hash = await bcrypt.hash(password, 12);
		await item.User.setUserNick(req.user.id, nick, hash);
		UserCache[req.user.id].Status = 3;
		return res.redirect('/');	
	} catch(error){
		console.error(error);
		next(error);
	}
};

exports.following = async (req, res, next) => {
	const follower = req.params.id;
	try{
		if(await item.setFollow(req.user.id, follower)){
			UserCache[req.user.id].Status = 1;
			return res.send('success');
		}
		return res.status(404).send('no user');
	} catch(error){
		console.error(error);
		next(error);
	}
}

	
exports.followDelete = async (req, res, next) => {
	const follower = req.params.id;
	try{
		await item.delFollow(req.user.id, follower);
		UserCache[req.user.id].Status = 1;
		return res.send("DELETE succese");
	} catch(error){
		console.error(error);
		next(error);
	}
}

exports.likeing = async (req, res, next) => {
	const postid = req.params.id;
	try{
		if(await item.setLike(req.user.id, postid)){
			UserCache[req.user.id].Status = 2;
			return res.redirect('/');
		}
		return res.send('already done');	
	} catch(error){
		console.error(error);
		next(error);
	}
}

exports.likeDelete = async (req, res, next) => {
	const postid = req.params.id;
	try{
		await item.delLike(req.user.id, postid);
		UserCache[req.user.id].Status = 2;
		return res.send("DELETE succese");	
	} catch(error){
		console.error(error);
		next(error);
	}
}