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