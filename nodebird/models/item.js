const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);
const con = pool.promise();

const { User } = require('./User');
const { Post } = require('./Post');
const { Hashtag } = require('./Hashtag');
const { Good } = require('./Good');
const { Follow } = require('./Follow');

const item = {
	
	getAllPostInfo: async () => {
		const posts = await Post.getPost();
		try{
			await Promise.all(posts.map(async (post) => {
				const likeCount = await Good.getGoodByPostId(post.id);
				const auther = await User.getUser(post.contenter);
				post.LikeCount = likeCount.length;
				post.auther = auther.nick;
				return post;
			}))
		} catch (error) {
			console.error(error);
		}
		return posts;
	},
	
	getPostHashtagInfo: async (hashtag) => {
		let row = await Hashtag.getHashtagByTitle(hashtag);
		console.log(row);
		let posts;
		try{
			if(row.length != 0){
				const hashtagId = row[0].id;
				let [rows, fields] = await con.query(`SELECT Post.id, Post.contenter, Post.content, Post.img FROM PostHashtag JOIN Post ON Post.id = PostHashtag.postId WHERE PostHashtag.hashtagId = ?`, hashtagId);
				posts = rows;
				// .map 메소드에서 await을 사용하기 위해선 Promise.all을 사용해야 함.
				await Promise.all(posts.map(async (post) => {
				const likeCount = await Good.getGoodByPostId(post.id);
				const auther = await User.getUser(post.contenter);
				post.LikeCount = likeCount.length;
				post.auther = auther.nick;
					return post;
				}));
			}
			return posts;
		} catch (error){
			console.error(error);
		}
	},
	
	addFollow: async (id, follower) => {
		try{
			let [rows, fields] = await con.query(`SELECT * FROM Follow WHERE followingId = ? AND followerId = ?`, [id, follower]);
			if(rows.length == 0){
				await con.query(`INSERT INTO Follow(followingId, followerId) VALUES(?,?)`, [id, follower]);
				return 1;
			} else {
				return 0;
			}
		} catch(error) {
			console.error(error);
		}
	},
	
	delFollow: async (id, follower) => {
		try{
			await con.query(`DELETE FROM Follow WHERE followingId = ? AND followerId = ?`, [id, follower]);	
		} catch(error) {
			console.error(error);
		}
	},
	
	addLike: async (id, post) => {
		try{
			let [rows, fields] = await con.query(`SELECT * FROM Good WHERE userId = ? AND postId = ?`, [id, post]);
			if(rows.length == 0){
				await con.query(`INSERT INTO Good (userId, postId) VALUES(?,?)`, [id, post]);
				return 1;
			} else {
				return 0;
			}	
		} catch(error){
			console.error(error);
		}
	},
	
	delLike: async (id, post) => {
		try{
			await con.query('DELETE FROM Good WHERE userId = ? AND postId = ?', [id, post]);	
		} catch(error) {
			console.error(error);
		}
	},
	
	User, Post, Hashtag,
};

exports.item = item;