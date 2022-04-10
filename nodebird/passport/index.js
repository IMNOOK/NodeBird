const passport = require('passport');
const local = require('./localStrategy');
const dbconfig = require("../config");
const { item } = require('../models/item');

let UserCache = [];

exports.passportConfig = () => {
	
	passport.serializeUser((user, done) => {
		UserCache[user.id] = user;
		UserCache[user.id].Followers = [];
		UserCache[user.id].Followings = [];
		UserCache[user.id].GoodPostId = [];
		UserCache[user.id].Status = -1;	//캐시 변경값 확인 변수
		done(null, user.id);
	});
	
	passport.deserializeUser( async (id, done) => {
		try{
			let result;
			console.log(UserCache[id].Status);
			if(UserCache[id].Status == -1 ){ //초기값
				result = await item.getFollowing(id);
				UserCache[id].Followings = result;
				result = await item.getLike(id);
				UserCache[id].GoodPostId = result;
				UserCache[id].Status = 0; //변경값 없음
			} else if(UserCache[id].Status == 1 ) { //팔로잉 변경
				result = await item.getFollowing(id);
				UserCache[id].Followings = result;
			} else if(UserCache[id].Status == 2 ) { //좋아요 변경
				result = await item.getLike(id);
				UserCache[id].GoodPostId = result;
			} else if(UserCache[id].Status == 3){ //닉네임 변경
				result = await item.User.getUserNick(id);
				UserCache[id].nick = result.nick;
			}
			//팔로워 변경값
			result = await item.getFollower(id);
			UserCache[id].Followers = result;
			done(null, UserCache[id]);
		} catch (error) {
			console.error(error);
			done(error);
		}
	});
	
	local();
}

exports.UserCache = UserCache;