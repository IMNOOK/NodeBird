//다른 사람들이 만든 모듈
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn, con } = require('./middlewares');

// routes 코드 시작 및 각종 설정
const router = express.Router();

try{
	fs.readdirSync('uploads');
} catch(error) {
	console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
	fs.mkdirSync('uploads');
}

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

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
	console.log(req.file);
	res.json({url: `/img/${req.file.filename}`});
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
	try{
		const createPost = await con.query(`INSERT INTO Post(contenter, content, img) VALUES (?, ?, ?)`, [req.user.id, req.body.content, req.body.url]);
		const hashtag = req.body.content.match(/#[^\s#]+/g);
		if(hashtag) {
			const result = await Promise.all(
				hashtag.map( async (tag) => {
					console.log(tag.slice(1).toLowerCase());
					let [rows, fields]= await con.query(`SELECT * FROM Hashtag WHERE title = ?` ,tag.slice(1).toLowerCase());
					if(rows.length != 0){
						return rows[0].id;
					}
					const createHashtag = await con.query(`INSERT INTO Hashtag(title) VALUES (?)`,tag.slice(1).toLowerCase());
					return createHashtag[0].insertId;
				})
			);
			console.log('this is result ');
			console.log(result);
			result.map( async (r) => {
				console.log(createPost[0].insertId, r);
				const createPostHashtag = await con.query(`INSERT INTO PostHashtag(postId, hashtagId) VALUES(?, ?)` ,[createPost[0].insertId ,r]);
			});
		}
	return res.redirect('/');
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.delete('/:id', isLoggedIn, async (req, res, next) => {
	const postId  = req.params.id;
	try{
		let [rows, fields] = await con.query('SELECT * FROM Post WHERE id = ? AND contenter = ?', [postId, req.user.id]);
		if(rows.length != 0) {
			await con.query('DELETE FROM Post WHERE id = ? AND contenter = ?', [postId, req.user.id]);
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
	return res.render('main', {
			title: 'NodeBird'
	});
});

module.exports = router;