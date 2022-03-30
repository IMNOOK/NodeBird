const { item } = require('../models/item');

exports.posting = async (req, res, next) => {
	try{
		await item.setPost(req.user.id, req.body.content, req.body.url);
		return res.redirect('/');
	} catch(error){
		console.error(error);
		next(error);
	}
}

exports.deletePost = async (req, res, next) => {
	const postId  = req.params.id;
	try{
		item.Post.delPost(postId);
	} catch (error) {
		console.error(error);
		next(error);
	}
	return res.render('main', {
			title: 'NodeBird'
	});
}