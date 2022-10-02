const express = require("express");
const app = express();

const PORT = process.env.PORT || 5701;

app.use(express.json());

const filmsRouter = require("./controllers/film");
app.use("/films", filmsRouter);

const customersRouter = require("./controllers/customers");
app.use("/customers", customersRouter);

app.listen(PORT, () => {
	console.log(`Server is now listening on ${PORT}`);
});
