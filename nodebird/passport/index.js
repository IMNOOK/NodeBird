const passport = require('passport');
const local = require('./localStrategy');
const mysql = require("mysql2/promise");
const dbconfig = require("../config");

const con = mysql.createPool(dbconfig);
const UserCach = [];

module.exports = () => {
	UserCach,
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	
	passport.deserializeUser( async (id, done) => {
		try{
			if(UserCach[id] !== undefined ){
				done(null, UserCach[id]);
			} else {
			let [rows, fields] = await con.query(`SELECT * FROM User Where id = ?`, id);
			const user = rows[0];
				[rows, fields] = await con.query('SELECT * FROM Follow JOIN User ON Follow.followingId = User.id Where Follow.followerId = ?', id);
				user.Followers = rows;
				[rows, fields] = await con.query('SELECT * FROM Follow JOIN User ON Follow.followerId = User.id WHERE Follow.followingId = ?', id);
				user.Followings = rows;
				[rows, fields] = await con.query('SELECT * FROM Good JOIN User ON Good.userId = User.id WHERE User.id = ?', id);
				user.GoodPostId = rows;
				UserCach[id] = user;
				done(null, user);
			}
		} catch (error) {
			console.error(error);
			done(error);
		}
	});
	
	local();
}