import axios from "axios";

test("Deve fazer um pedido", async function () {
	const inputCheckout = {
		email: "john.doe@gmail.com",
		items: [
			{ productId: 1, quantity: 1 },
			{ productId: 2, quantity: 1 },
			{ productId: 3, quantity: 3 }
		]
	}
	const responseCheckout = await axios.post("http://localhost:3001/checkout", inputCheckout);
	const outputCheckout = responseCheckout.data;
	expect(outputCheckout.orderId).toBeDefined();
	const responseGetOrder = await axios.get(`http://localhost:3001/orders/${outputCheckout.orderId}`);
	const outputGetOrder = responseGetOrder.data;
	expect(outputGetOrder.email).toBe("john.doe@gmail.com");
	expect(outputGetOrder.total).toBe(6090);
});

test("Deve fazer um pedido com cupom de desconto", async function () {
	const inputCheckout = {
		email: "john.doe@gmail.com",
		items: [
			{ productId: 1, quantity: 1 },
			{ productId: 2, quantity: 1 },
			{ productId: 3, quantity: 3 }
		],
		coupon: "VALE20"
	}
	const responseCheckout = await axios.post("http://localhost:3001/checkout", inputCheckout);
	const outputCheckout = responseCheckout.data;
	expect(outputCheckout.orderId).toBeDefined();
	const responseGetOrder = await axios.get(`http://localhost:3001/orders/${outputCheckout.orderId}`);
	const outputGetOrder = responseGetOrder.data;
	expect(outputGetOrder.email).toBe("john.doe@gmail.com");
	expect(outputGetOrder.total).toBe(4872);
});

test("Deve fazer um pedido com cupom de desconto expirado", async function () {
	const inputCheckout = {
		email: "john.doe@gmail.com",
		items: [
			{ productId: 1, quantity: 1 },
			{ productId: 2, quantity: 1 },
			{ productId: 3, quantity: 3 }
		],
		coupon: "VALE20_EXPIRED"
	}
	const responseCheckout = await axios.post("http://localhost:3001/checkout", inputCheckout);
	const outputCheckout = responseCheckout.data;
	expect(outputCheckout.orderId).toBeDefined();
	const responseGetOrder = await axios.get(`http://localhost:3001/orders/${outputCheckout.orderId}`);
	const outputGetOrder = responseGetOrder.data;
	expect(outputGetOrder.email).toBe("john.doe@gmail.com");
	expect(outputGetOrder.total).toBe(6090);
});
