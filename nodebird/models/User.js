const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const User = {	
	setUser: async (email, nick, password) => {
		if(User.getUserByEmail(email)) {
			return 0;
		} else {
			try{
				await con.query('INSERT INTO User(email, nick, password) VALUES(?,?,?)', [email, nick, password]);	
			} catch(error){
				console.error(error);
			}
			return 1;
		}
	},
	
	setUserNick: async (id, nick, password) => {
		try{
			await con.query('UPDATE User SET nick = ? , password = ? WHERE id = ?', [nick, password, id]);	
		} catch(error){
			console.log(error);
		}
	},
	
	getUser: async (id) => {
		try{
			const [rows, fields] = await con.query('SELECT * FROM User WHERE User.id = ?', id);
			return rows[0];
		} catch(error){
			console.log(error);
		}
	},
	
	getUserByEmail: async (email) => {
		const [rows, fields] = await con.query('SELECT * FROM User WHERE User.email = ?', email);
	}
};

exports.User = User;