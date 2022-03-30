const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const Hashtag = {
	setHashtag: async (title) => {
		try{
			const result = await con.query('INSERT INTO Hashtag(title) VALUES (?)', title);
			return result;
		} catch(error){
			console.error(error);
		}
	},
	
	getHashtag: async (title) => {
		try{
			let [rows, fields] = await con.query('SELECT id FROM Hashtag WHERE title = ?' , title);
			return rows;
		} catch(error) {
			console.log(error);
		}
	},
};

exports.Hashtag = Hashtag;