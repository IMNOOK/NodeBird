const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const Post = {
	setPost: async (contenter, content, img) => {
		try{
			const result = await con.query('INSERT INTO Post(contenter, content, img) VALUES (?, ?, ?)', [contenter, content, img]);
			return result;
		} catch(error){
			console.error(error);
		}
	},
	
	getPost: async () => {
		try{
			let [rows, fields] = await con.query('SELECT * FROM Post');
			return rows;
		} catch (error){
			console.error(error);
		}
	},
	
	delPost: async (postId) => {
		try{
			const result = await con.query('DELETE FROM Post WHERE id = ?', postId);
			return result;
		} catch (error){
			console.error(error);
		}
	}
};

exports.Post = Post;