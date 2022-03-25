const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const User = {
	User: async (email)
	
	setUsernick: async (id, nick, password) => {
		await con.query('UPDATE User SET nick = ? , password = ? WHERE id = ?', [nick, password, id]);
	},
	
	addFollow: async (id, follower) => {
		await con.query('INSERT INTO Follow(followingId, followerId) SELECT ?,? FROM DUAL WHERE NOT EXISTS (SELECT * FROM Follow WHERE followingId = ? AND followerId = ?)',[id, follower, id, follower]);
	},
	
	delFollow: async (id, follower) => {
		await con.query('DELETE FROM Follow WHERE followingId = ? AND followerId = ?', [id, follower]);	
	},
	
	addLike: async (id, post) => {
		await con.query('INSERT INTO Good (userId, postId) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM Good WHERE userId = ? AND postId = ?)', [id, post, id, post]);
	},
	
	delLike: async (id, post) => {
		await con.query('DELETE FROM Good WHERE userId = ? AND postId = ?', [id, post]);
	}
};

exports.User = User;