const { con } = require('./middlewares');

exports.posting = async (req, res, next) => {
	try{
		console.log(req.body.content);
		const createPost = await con.query('INSERT INTO Post(contenter, content, img) VALUES (?, ?, ?)', [req.user.id, req.body.content, req.body.url]);
		
		const hashtag = req.body.content.match(/#[^\s#]+/g);
		if(hashtag) {
			const result = await Promise.all(
				hashtag.map( async (tag) => {
					const tags = tag.slice(1).toLowerCase();
					const createHashtag = await con.query('INSERT INTO Hashtag (title) SELECT ? FROM dual WHERE NOT EXISTS (SELECT *  FROM Hashtag WHERE  title = ?)', [tags, tags]);
					console.log(createHashtag);
					return createHashtag[0].insertId;
				})
			);
			result.map( async (r) => {
				console.log(r);
				const createPostHashtag = await con.query('INSERT INTO PostHashtag(postId, hashtagId) VALUES(?,?)', [createPost[0].insertId, r]);
			});
		}
		return res.redirect('/');
	} catch(error){
		console.error(error);
		next(error);
	}
}

exports.deletePost = async (req, res, next) => {
	const postId  = req.params.id;
	try{
		const result = await con.query('DELETE FROM Post WHERE id = ?', postId);
		console.log(result);
	} catch (error) {
		console.error(error);
		next(error);
	}
	return res.render('main', {
			title: 'NodeBird'
	});
}