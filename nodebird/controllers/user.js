const bcrypt = require('bcrypt');

const { User } = require('../models/User.js');
const {UserCache} = require('../passport');

exports.updateProfile = async (req, res, next) => {
	const { nick, password } = req.body;
	const hash = await bcrypt.hash(password, 12);
	try{
		User.setUsernick(req.body.id, nick, hash);
		UserCache[req.user.id].Status = 3;
		return res.redirect('/');
	} catch(error) {
		console.error(error);
		next(error);
	}
};

exports.following = async (req, res, next) => {
	const follower = req.params.id;
	try{
		User.addFollow(req.user.id, follower);
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
		console.log(follower);
		User.delFollow(req.user.id, follower);
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
		User.addLike(req.user.id, postid);
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
		User.delLike(req.user.id, postid);
		UserCache[req.user.id].Status = 2;
    	return res.send("DELETE succese");
	} catch(error) {
		console.error(error);
		next(error);
	}
}