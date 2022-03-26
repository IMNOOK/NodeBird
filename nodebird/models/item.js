const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig.develop);
const con = pool.promise();

const { User } = require('./User');
const { Post } = require('./Post');
const { Hashtag } = require('./Hashtag');

const item = {
	
	getAllPostInfo: async () => {
		const posts = Post.getPost();
		await Promise.all(posts.map(async (post) => {
			
		}))
	},
	
	addFollow: async (id, follower) => {
		let [rows, fields] = await con.query('SELECT FROM Follow WHERE followingId = ? AND followerId = ?', [id, follower]);
		if(rows.length == 0){
			await con.query('INSERT INTO Follow(followingId, followerId) VALUES(?,?)', [id, follower]);
			return 1;
		} else {
			return 0;
		}
	},
	
	delFollow: async (id, follower) => {
		await con.query('DELETE FROM Follow WHERE followingId = ? AND followerId = ?', [id, follower]);	
	},
	
	addLike: async (id, post) => {
		let [rows, fields] = await con.query('SELECT * FROM Good WHERE userId = ? AND postId = ?', [id, post]);
		if(rows.length == 0){
			await con.query('INSERT INTO Good (userId, postId) VALUES(?,?)', [id, post]);
			return 1;
		} else {
			return 0;
		}
	},
	
	delLike: async (id, post) => {
		await con.query('DELETE FROM Good WHERE userId = ? AND postId = ?', [id, post]);
	},
	
	User, Post, Hashtag,
};

exports.User = User;