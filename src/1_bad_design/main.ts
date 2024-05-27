import express from "express";
import crypto from "crypto";
import pgp from "pg-promise";
const app = express();
app.use(express.json());

app.post("/checkout", async function (req, res) {
	const orderId = crypto.randomUUID();
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	let total = 0;
	for (const item of req.body.items) {
		const [productData] = await connection.query("select * from branas.product where product_id = $1", [item.productId]);
		total += parseFloat(productData.price) * item.quantity;
	}
	if (req.body.coupon) {
		const [couponData] = await connection.query("select * from branas.coupon where code = $1", [req.body.coupon]);
		const today = new Date();
		if (couponData.expire_date.getTime() >= today.getTime()) {
			total -= (total * parseFloat(couponData.percentage))/100;
		}
	}
	await connection.query("insert into branas.order (order_id, email, total) values ($1, $2, $3)", [orderId, req.body.email, total]);
	await connection.$pool.end();
	res.json({
		orderId
	});
});

app.get("/orders/:orderId", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [orderData] = await connection.query("select * from branas.order where order_id = $1", [req.params.orderId]);
	await connection.$pool.end();
	res.json({
		email: orderData.email,
		total: parseFloat(orderData.total)
	});
});

app.listen(3000);