const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig.develop);
const con = pool.promise();

const Post = {
	getPost: async () => {
		let [rows, fields] = await con.query('SELECT * FROM Post');
		return rows;
	}
};

exports.Post = Post;