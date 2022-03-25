꼭 읽기!
https://brunch.co.kr/@jehovah/20

FRONT 
https://www.pinkcoding.com/class/web/HTML/

https://backlog.com/git-tutorial/kr/stepup/stepup2_3.html

-git setting
git config --global user.email "leeminwok0405@gmail.com"
git config --global user.name "IMNOOK"# NodeBird
echo "# NodeBird" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/IMNOOK/NodeBird.git
git push -u origin main
IMNOOK
토큰 비번
// git 토큰 인증
echo -e "node_modules\ndist/*\n.log" >> .gitignore

모두들 순서는 나와 동일할 것 같다.
1. git status
2. git add .
3. git commit -m "주저리주저리"
4. git push [repo alias] [branch]
5. ID/PW 또는 ID/Access-token 입력

브랜치는 branch 란 명령어로 만들 수 있습니다.

$ git branch <branchname>

다음과 같이checkout 명령어 뒤에 사용할 브랜치 이름을 입력하면 됩니다.

$ git checkout <branch>

------------데이터베이스--------------------------------------------------------------------------------------------------------

mysql 설치 및 기타 설정 
apt-get install mysql-server mysql-client 
service mysql start
use mysql; 
create user 'IMNOOK'@'%' identified by 'dhksthxpa12';
GRANT ALL PRIVILEGES ON *.* to 'IMNOOK'@'%' IDENTIFIED BY 'dhksthxpa12'; 
flush privileges;

포트포워딩 준비 
vim /etc/mysql/mysql.conf.d/mysqld.cnf //포트 변경 or bind-address 주석처리 
/etc/init.d/mysql restart 
컨테이너 - 포트포워딩 IP와 외부 포트, 내부 포트(3306) 확인

$ vim /etc/mysql/my.cnf
해당 파일의 마지막에 다음과 같은 내용을 덧붙여준다.
...
[client]
default-character-set=utf8

[mysql]
default-character-set=utf8

[mysqld]
collation-server = utf8_unicode_ci
init-connect='SET NAMES utf8'
character-set-server = utf8

1. 프로젝트 구조 갖추기
-express project start
cd projectFile
npm init
npm i express // make package.json
npm i -D nodemon // -D = Development
npm i sequelize mysql2 sequelize-cli // make package-lock.json
npx sequelize init // make config, migrations, models, seeders folder
npm i cookie-parser express-session morgan dotenv nunjucks
mkdir passport
mkdir public
mkdir routes
mkdir views
// make app.js
nodebird/app.js
// make .env
nodebird/.env
// make front-end
routes/page.js -> 모든 요청에 res.locals.~ = ~ 넌적스에 사용값 저장, get요청에 /profile(내 정보), /join(회원가입)
views/layout.html
views/main.html
views/profile.html
views/join.html
views/error.html
public/main.css

2. 데이터베이스 세팅
//모델 생성 static init
models/index.js -> db.sequelize = new Sequlize(config...), db.models, models.init(sequelize), models.associate(db)
models/user.js -> static init(sequelize) {{super.init}, {sequzelize, etc...} }, static associate(db){...}
models/post.js -> static init(sequelize) {{super.init}, {sequzelize, etc...} }, static associate(db){...}
models/hashtag.js -> static init(sequelize) {{super.init}, {sequzelize, etc...} }, static associate(db){...}
//모델 관계 연결 static assoicate
user:post = 1:1, hasMany:belongsTo
user:user = N:M, belongsToMany:belongsToMany, User - Follow - User (foriegnKey, as, through)
post:hashtag = N:M belongsToMany:belongsToMany, post - PostHashtag - hashtag (through)
// 데이터베이스 생성 및 모델을 서버와 연결
config/config.json
npx sequelize db:create
app.js 수정

3. Passport 모듈로 로그인 구현
npm i passport passport-local passport-kakao bcrypt
//Passport 모듈을 미리 app.js와 연결
app.js -> passportConfig(); //패스포트 설정 ,app.use(passport.initialize()): req객체에 passport 설정을 심음, app.use(passport.session()): req.session 객체에 passport 정보를 저장
//passport 파일 생성 밑 Passport 관련 코드를 작성
passport/index.js ->
	passport.serializeUser - 로그인시 실행, req.session 객체에 어떤 데이터를 저장할지 정함, 매개변수로 user를 받고 done 함수에 user.id를 넘김
	passport.deserializeUser - 매 요청시 실행, serializeUser의 넘긴 user.id 데이터가 deserializeUser의 매개변수가 됨. 세션에 저장한 아이디를 받아 데이터베이스에서 사용자 정보를 조회하고 그 정보를 req.user에 저장함.
/*
serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것이고,
deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러 오는 것.
세션에 불필요한 데이터를 담아두지 않기 위한 과정!
*/

전체 과정은 다음과 같다.
1. 라우터를 통해 로그인 요청이 들어옴
2. 라우터에서 passport.authenticate 메서드 호출
3. 로그인 전략 수행
4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
5. req.login 메서드가 passport.serializeUser 호출
6. req.sesion에 사용자 아이디만 저장
7. 로그인 완료
1~4번은 아직 구현 안함.
다음은 로그인 이후의 과정
1. 요청이 들어옴
2. 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 passport.deserializeUser 메서드 호출
3. req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
4. 조회된 사용자 정보를 req.user에 저장
5. 라우터에서 req.user 객체 사용가능

passport/index.js의 localStrategy와 kakaoStrategy 파일은 각각 로컬  로그인과 카카오 로그인 전략에 대한 파일이다.
Passport는 로그인 시의 동작을 전략(strategy)이라는 용어로 표현한다.

3.1 로컬 로그인 구현하기
다른 SNS 서비스 이용X -> passport-local 모듈이 필요
회원가입, 로그인, 로그아웃 라우터를 만들기전에 이러한 라우터에는 접근 조건이 있다.
로그인한 사용자는 회원가입과 로그인 라우터에 접근하면 안되고, 로그인하지 않은 사용자는 로그아웃 라우터에 접근하면 안된다.
따라서 라우터에 접근 권한을 제어하는 미들웨어가 필요하다.
routes/middlewares.js -> isLoggedIn = 로그인한 사용자만 next(), isNotLoggedIn = 로그인하지 않은 사용자만 next()
Passport는 req 객체에 isAuthenticated 메서드를 추가한다. 로그인 중이면 true 아니면 false이다.
routes/page.js -> res.locals.user = req.user를 통해 넌전스에서 user 객체 접근, + router.get('/profile', isLoggedIn, (req, res) =>...); router.get('/join', isNotLoggedIn, (req, res)=>...);
이후 회원가입, 로그인, 로그아웃 라우터 작성
routes/auth.js -> post /join: if(exUser) res.redirect('') else User.create(), , post /login: passport.authenticate('local', 콜백(req,res,next)) , get /logout: req.logout, req.session.destroy 
passport/localStrategy.js: passport.use(new LocalStrategy)
passport/kakaoStrategy.js: passport.use(new KakaoStrategy)

4. multer 패키지로 이미지 업로드 구현
npm i multer
게시글을 작성하는 기능을 만들기 위해
routes/post.js ->
uploads/ 파일 생성, upload = multer(storage: multer.diskStorage({destination, filename})), upload.single('img'), 
upload2 = multer(), upload2.none(), post = await Post.create(), hashtag = req.body.content.match() -> hashtags.map -> Pormise.all -> result.map(r => r[0]) => post.addHastag()
routes/page.js -> router.get('/') -> posts = await Post.findAll({include: User}), res.render('main', {title: , twist:posts })

5. 프로젝트 마무리
다른 사용자를 팔로우하는 기능을 만들기 위해
routes/user.js ->