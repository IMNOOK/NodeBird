const passport = require('passport');
const local = require('./localStrategy');
const mysql = require("mysql2/promise");
const dbconfig = require("../config");

const con = mysql.createPool(dbconfig);
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
			let rows, fields;
			console.log(UserCache[id].Status);
			if(UserCache[id].Status == -1 ){ //초기값
				[rows, fields] = await con.query('SELECT Follow.followerId, User.nick, User.id FROM Follow JOIN User ON Follow.followerId = User.id WHERE Follow.followingId = ?', id);
				UserCache[id].Followings = rows;
				[rows, fields] = await con.query('SELECT Good.postId FROM Good JOIN User ON Good.userId = User.id WHERE User.id = ?', id);
				UserCache[id].GoodPostId = rows;
				UserCache[id].Status = 0; //변경값 없음
			} else if(UserCache[id].Status == 1 ) { //팔로잉 변경
				[rows, fields] = await con.query('SELECT Follow.followerId, User.nick, User.id FROM Follow JOIN User ON Follow.followerId = User.id WHERE Follow.followingId = ?', id);
				UserCache[id].Followings = rows;
			} else if(UserCache[id].Status == 2 ) { //좋아요 변경
				[rows, fields] = await con.query('SELECT Good.postId FROM Good JOIN User ON Good.userId = User.id WHERE User.id = ?', id);
				UserCache[id].GoodPostId = rows;
			} else if(UserCache[id].Status == 3){ //닉네임 변경
				[rows, fields] = await con.query('SELECT User.nick FROM User WHERE id = ?',id);
				UserCache[id].nick = rows[0].nick;
			}
			//팔로워 변경값
			[rows, fields] = await con.query('SELECT Follow.followingId, User.nick FROM Follow JOIN User ON Follow.followingId = User.id Where Follow.followerId = ?', id);
			UserCache[id].Followers = rows;
			done(null, UserCache[id]);
		} catch (error) {
			console.error(error);
			done(error);
		}
	});
	
	local();
}

exports.UserCache = UserCache;