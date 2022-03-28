const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const Hashtag = {
	getHashtagByTitle: async (title) => {
		try{
			let [rows, fields] = await con.query('SELECT id FROM Hashtag WHERE title = ?' , title);
			return rows;
		} catch(error) {
			console.log(error);
		}
	},
};

exports.Hashtag = Hashtag;