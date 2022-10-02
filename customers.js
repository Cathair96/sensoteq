const express = require("express");
const pool = require("./pg");

const customersRouter = express.Router();

customersRouter.post("/:store_id/:first_name/:last_name/:email/:phone/:address/:address2/:district/:city_id/:postal_code", async (req, res) => {
	try {
		const { store_id, first_name, last_name, email, phone, address, address2, district, city_id, postal_code } = req.params;
		const newCustomer = await pool.query(
			`
			INSERT INTO address (address_id, address, address2, district, city_id, postal_code, phone, last_update)
			SELECT * FROM (
				VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, DEFAULT)
			) AS t (integer, character varying(50), character varying(50), character varying (20), smallint, character varying(10), character varying(20), timestamp without time zone)
			WHERE (
				SELECT city_id FROM city WHERE city_id = $4
			) = $4;

			INSERT INTO customer (customer_id, store_id, first_name, last_name, email, address_id, activebool, create_date, last_update, active)
			SELECT * FROM (
				VALUES (
					DEFAULT, $8, $9, $10, $11, SELECT address_id FROM address WHERE city_id = $4, DEFAULT, DEFAULT, DEFAULT, 1
				)
			) AS t (integer, smallint, character varying (45), character varying(45), character varying(50), smallint, boolean, date, timestamp without time zone, integer)
			WHERE (
				SELECT address_id FROM address WHERE city_id = $4	
			) IS NOT NULL;
		`,
			[address, address2, district, city_id, postal_code, phone, store_id, first_name, last_name, email]
		);
		res.send(newCustomer);
	} catch (error) {
		res.status(404).send(error.message);
	}
});

customersRouter.post("/:customer_id", async (req, res) => {
	try {
		const customerId = req.params.customer_id;
		const removal = await pool.query(
			`
			DELETE FROM address
				WHERE address_id IN (SELECT address_id FROM customer WHERE customer_id = $1);
			
			DELETE FROM customer WHERE customer_id = $1;
		`,
			[customerId]
		);
		res.send(removal);
	} catch (error) {
		res.status(404).send(error.message);
	}
});

module.exports = customersRouter;
