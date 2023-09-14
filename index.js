// npm run dev
const express = require("express");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ["de8lrfgtyh45j1ukllkiju98hygt"],
	})
);
app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
