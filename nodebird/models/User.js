const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig.develop);
const con = pool.promise();

const User = {	
	setUser: async (email, nick, password) => {
		if(User.findUser(email)) {
			return 0;
		} else {
			await con.query('INSERT INTO User(email, nick, password) VALUES(?,?,?)', [email, nick, password]);
			return 1;
		}
	},
	
	setUsernick: async (id, nick, password) => {
		await con.query('UPDATE User SET nick = ? , password = ? WHERE id = ?', [nick, password, id]);
	},
};

exports.User = User;