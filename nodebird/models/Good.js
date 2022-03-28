const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const Good = {
	getGoodByPostId: async(postId) => {
		try{
			const [rows, fields] = await con.query('SELECT * FROM Good WHERE Good.postId = ?', postId);
			return rows;
		} catch(error) {
			console.error(error);
		}
	}
};

exports.Good = Good;