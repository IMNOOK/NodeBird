const { item } = require('../models/item');
const multer = require('multer');
const path = require('path');

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, 'uploads/');
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024}
});

const upload2 = multer();

exports.upload = upload;

exports.upload2 = upload2;

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