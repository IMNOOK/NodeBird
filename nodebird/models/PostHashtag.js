const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const PostHashtag = {
	setPostHashtag: async (postId, hashtagId) => {
		try{
			const result = await con.query('INSERT INTO PostHashtag(postId, hashtagId) VALUES(?,?)', [postId, hashtagId]);
			return result;
		} catch(error) {
			console.error(error);
		}
	} 
};

exports.PostHashtag = PostHashtag;