import express from "express";
import OrderService from "./2_application";
import { ProductionDatabase } from "./3_resource";
const app = express();
app.use(express.json());

const database = new ProductionDatabase();
const orderService = new OrderService(database);
app.post("/checkout", async function (req, res) {
	const output = await orderService.checkout(req.body);
	res.json({
		orderId: output.orderId
	});
});

app.get("/orders/:orderId", async function (req, res) {
	const output = await orderService.getOrder(req.params.orderId)
	res.json(output);
});

app.listen(3001);