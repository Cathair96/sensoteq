const express = require("express");
const pool = require("../pg");

const filmsRouter = express.Router();

filmsRouter.get("/categories", async (req, res) => {
	try {
		const categoryName = req.query.category_name;
		const films = await pool.query(
			`
        SELECT film_id, title, description, rental_rate
        FROM film
        JOIN film_category
        ON film.film_id = film_category.film_id
        JOIN category
        ON film_category.category_id = category.category_id
        WHERE category.name = $1`,
			[categoryName]
		);
		res.send(films);
	} catch (error) {
		res.status(404).send(error.message);
	}
});

filmsRouter.get("/length", async (req, res) => {
	try {
		const { title, length } = req.query;
		const query = `
		SELECT film.title, film.length, category.name, language.name
		FROM film
		JOIN film_category
		ON film.film_id = film_category.film_id
		JOIN category
		ON film_category.category_id = category.category_id
		JOIN language
		ON film.language_id = language.language_id`;

		if (title) {
			query = query + ` WHERE film.title LIKE '$1'`;
		}

		if (!isNaN(length)) {
			query = query + ` AND film.length < $2`;
		}
		const films = await pool.query(query, [title, length]);
		res.send(films);
	} catch (error) {
		res.status(404).send(error.message);
	}
});

module.exports = filmsRouter;
