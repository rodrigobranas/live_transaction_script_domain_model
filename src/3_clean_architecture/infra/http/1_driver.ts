import express from "express";
import Checkout from "../../application/Checkout";
import GetOrder from "../../application/GetOrder";
import { ProductRepositoryDatabase } from "../database/ProductRepository";
import { OrderRepositoryDatabase } from "../database/OrderRepository";
import { CouponRepositoryDatabase } from "../database/CouponRepository";
import GetOrderQuery from "../../application/GetOrderQuery";
const app = express();
app.use(express.json());

const productRepository = new ProductRepositoryDatabase();
const couponRepository = new CouponRepositoryDatabase();
const orderRepository = new OrderRepositoryDatabase();
const checkout = new Checkout(orderRepository, couponRepository, productRepository);
const getOrder = new GetOrder(orderRepository);
const getOrderQuery = new GetOrderQuery();
app.post("/checkout", async function (req, res) {
	const output = await checkout.execute(req.body);
	res.json({
		orderId: output.orderId
	});
});

app.get("/orders/:orderId", async function (req, res) {
	const output = await getOrderQuery.execute(req.params.orderId)
	res.json(output);
});

app.listen(3001);