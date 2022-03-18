const passport = require('passport');
const local = require('./localStrategy');
const mysql = require("mysql2/promise");
const dbconfig = require("../config");

const con = mysql.createPool(dbconfig);
let UserCache = [];

exports.passportConfig = () => {
	
	passport.serializeUser((user, done) => {
		UserCache[user.id] = user;
		UserCache[user.id].Followers = -1;
		UserCache[user.id].GoodPostId = -1;
		done(null, user.id);
	});
	
	passport.deserializeUser( async (id, done) => {
		try{
			let rows, fields, user;
			if(UserCache[id].Followers == -1){
				user = UserCache[id];
				[rows, fields] = await con.query('SELECT * FROM Follow JOIN User ON Follow.followingId = User.id Where Follow.followerId = ?', id);
				user.Followers = rows;
				[rows, fields] = await con.query('SELECT * FROM Follow JOIN User ON Follow.followerId = User.id WHERE Follow.followingId = ?', id);
				user.Followings = rows;
				[rows, fields] = await con.query('SELECT * FROM Good JOIN User ON Good.userId = User.id WHERE User.id = ?', id);
				user.GoodPostId = rows;
				UserCache[id] = user;
			} else{
				[rows, fields] = await con.query('SELECT * FROM Follow JOIN User ON Follow.followerId = User.id WHERE Follow.followingId = ?', id);
				UserCache[id].Followings = rows;
				user = UserCache[id];
			}
			done(null, user);
		} catch (error) {
			console.error(error);
			done(error);
		}
	});
	
	local();
}

exports.UserCache = UserCache;