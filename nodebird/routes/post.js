//다른 사람들이 만든 모듈
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn } = require('./middlewares');
const { posting } = require('../controllers/post');

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
router.post('/', isLoggedIn, upload2.none(), (req, res, next) => posting(req, res, next));

router.delete('/:id', isLoggedIn, (req, res, next) => deletePost(req, res, next));

module.exports = router;