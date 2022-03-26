const mysql = require("mysql2");
const dbconfig = require("./config"); 
const pool = mysql.createPool(dbconfig.test);
const con = pool.promise();

const User = {
	create: async (values) => {
		const colum = Object.keys(values);
		const value = Object.values(values).map(e => JSON.stringify(e));
		const sql = `INSERT INTO User (${colum}) VALUES (${value.join()})`;
		try{
			const result = await con.query(sql);
			console.log(result);
		} catch(error) {
			console.error(error);
		}
	},
	
	findAll: async (option) => {
		const attributes = Object.keys(option).includes('attributes');
		const where = Object.keys(option).includes('where');
		const order = Object.keys(option).includes('order');
		const limit = Object.keys(option).includes('limit');
		const offset = Object.keys(option).includes('offset');
		let value, colum;
		let sql = 'SELECT';
		
		
		if(attributes){
			colum = Object.values(option.attributes);
			console.log(colum);
			sql += ` ${colum} FROM User`
		} else {
			sql += ' * FROM User';
		}
		
		if(where) {
			colum = Object.keys(option.where);
			value = Object.values(option.where);
			sql += ' WHERE';
			colum.map( key => {
				
				sql += ` ${key}`
			})
		}
		
		try{
			const [rows, fields] = await con.query(sql);
			console.log("result2");
			console.log(rows);
		} catch (error) {
			console.error(error);
			console.log('error end');
		}
	},
	
	findOne: async (attribute) => {
		try{
			
		} catch (error) {
			console.error(error);
		}
	}
}

User.findAll({
	attributes: ['email', 'nick'],
	where: {
		nick: 'test',
		id: { gt: 0},
	},
	order: [['age', 'DESC']],
	limit: 1,
	offset: 1,
});

exports.User = User;