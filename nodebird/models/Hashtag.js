const mysql = require("mysql2");
const dbconfig = require("../config"); 
const pool = mysql.createPool(dbconfig.develop);
const con = pool.promise();

const Hashtag = {
	
};

exports.Hashtag = Hashtag;