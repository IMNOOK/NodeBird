//다른 사람들이 만든 모듈
const express = require('express');
const fs = require('fs');

// 내가 만든 모듈 or 미리 설정한 값 가져옴 
const { isLoggedIn } = require('../controllers/middlewares');
const { upload, upload2, posting, deletePost } = require('../controllers/post');

// routes 코드 시작 및 각종 설정
const router = express.Router();

try{
	fs.readdirSync('uploads');
} catch(error) {
	console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
	fs.mkdirSync('uploads');
}

//게시판 이미지 업로드
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
	console.log(req.file);
	res.json({url: `/img/${req.file.filename}`});
});


//게시판 글 올림
router.post('/', isLoggedIn, upload2.none(), posting);


//유저 == 글쓴이 시 게시판 삭제
router.delete('/:id', isLoggedIn, deletePost);

module.exports = router;