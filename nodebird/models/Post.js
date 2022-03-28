const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const Post = {
	getPost: async () => {
		try{
			let [rows, fields] = await con.query('SELECT * FROM Post');
			return rows;
		} catch (error){
			console.error(error);
		}
	}
};

exports.Post = Post;