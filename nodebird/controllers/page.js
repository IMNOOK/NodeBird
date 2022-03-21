const { con } = require('./db');

exports.UI = async (req, res, next) => {
	res.locals.user = req.user;
	res.locals.followerCount = req.user ? req.user.Followers.length : 0;
	res.locals.followingCount = req.user ? req.user.Followings.length : 0;
	res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.followerId) : [];
	res.locals.goodPostIdList = req.user ? req.user.GoodPostId.map(u => u.postId) : [];
	next();
}

exports.getMain = async (req, res, next) => {
	try{
		let [rows, fields] = await con.query('SELECT * FROM Post');
		const posts = rows;
		// .map 메소드에서 await을 사용하기 위해선 Promise.all을 사용해야함.
		await Promise.all(posts.map(async (post) => {
			[rows, fields] = await con.query('SELECT * FROM Good WHERE postId = ?', post.id);
			post.LikeCount = rows.length;
			[rows, fields] = await con.query('SELECT nick FROM User WHERE User.id = ?', post.contenter);
			post.auther = rows[0].nick;
			return post;
		}));
		
		return res.render('main', {
			title: 'NodeBird',
			twits: posts,
		});
	} catch(error) {
		console.error(error);
		return next(error);
	}
}

exports.getHashtag = async (req, res, next) => {
	const {hashtag} = req.query;
	try{
		let [rows, fields] = await con.query('SELECT id FROM Hashtag WHERE title = ?' , hashtag);
		let posts;
		if(rows.length != 0) {
			const hashtagId = rows[0].id;
			[rows, fields] = await con.query('SELECT Post.id, Post.contenter, Post.content, Post.img FROM PostHashtag JOIN Post ON Post.id = PostHashtag.postId WHERE PostHashtag.hashtagId = ?', hashtagId);
			posts = rows;
		// .map 메소드에서 await을 사용하기 위해선 Promise.all을 사용해야함.
		await Promise.all(posts.map(async (post) => {
			[rows, fields] = await con.query('SELECT * FROM Good WHERE postId = ?', post.id);
			post.LikeCount = rows.length;
			[rows, fields] = await con.query('SELECT nick FROM User WHERE User.id = ?', post.contenter);
			post.auther = rows[0].nick;
			return post;
		}));
		}
		return res.render('main', {
			title: 'NodeBird',
			twits: posts,
		});
	} catch(error) {
		console.error(error);
		return next(error);
	}
}