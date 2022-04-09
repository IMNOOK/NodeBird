const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const User = {	
	setUser: async (email, nick, password) => {
		const [rows, fields] = await con.query(`SELECT * FROM User WHERE User.email = ?`, email);
		if(rows.length != 0) {
			return 0;
		} else {
			try{
				await con.query(`INSERT INTO User(email, nick, password) VALUES(?,?,?)`, [email, nick, password]);	
			} catch(error){
				console.error(error);
			}
			return 1;
		}
	},
	
	getUser: async (id) => {
		try{
			const [rows, fields] = await con.query(`SELECT * FROM User WHERE User.id = ?`, id);
			return rows[0];
		} catch(error){
			console.log(error);
		}
	},
	
	setUserNick: async (id, nick, password) => {
		try{
			const result = await con.query(`UPDATE User SET nick = ?, password = ? WHERE id = ?`, [nick, password, id]);
		} catch(error){
			console.log(error);
		}
	},
	
	getUserNick: async (id) => {
		try{
			const [rows, fields] = await con.query(`SELECT User.nick FROM User WHERE User.id = ?`, id);
			return rows[0];
		} catch(error){
			console.log(error);
		}
	},
	
	getUserByEmail: async (email) => {
		try{
			const [rows, fields] = await con.query(`SELECT * FROM User WHERE User.email = ?`, email);
			return rows;
		}
		catch(error){
			console.error(error);
		}
	}
};

exports.User = User;