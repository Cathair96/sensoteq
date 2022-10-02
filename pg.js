const Pool = require("pg");
const pool = new Pool({
	host: "localhost",
	database: "dvdrental",
	port: 5432,
	user: "postgres",
	password: "postgres26",
});

module.exports = pool;
