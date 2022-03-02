const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig);

const con = pool.promise();

module.exports = () => {
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
	}, async (email, password, done) => {
		try{
			const [rows, fields] = await con.query(`SELECT * FROM User WHERE email = ?`,email);
			if(rows.length != 0) {
				const result = await bcrypt.compare(password, rows[0].password);
				if(result) {
					done(null, rows[0]);
				} else {
					done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
				}
			} else {
				done(null, false, {message: '가입되지 않은 회원입니다.'});
			}
		} catch (error){
			console.error(error);
			done(error);
		}
	}));
};