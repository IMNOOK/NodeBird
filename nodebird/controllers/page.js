const { item } = require('../models/item');

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
		const posts = await item.getAllPostInfo();
		return res.render('main', {
			title: 'NodeBird',
			twits: posts,
		});	
	} catch(error){
		console.error(error);
		return next(error);
	}
}

exports.getHashtag = async (req, res, next) => {
	const {hashtag} = req.query;
	try{
		const posts = await item.getPostHashtagInfo(hashtag);
		return res.render('main', {
			title: 'NodeBird',
			twits: posts,
		});
	} catch(error){
		console.error(error);
		return next(error);
	}
}