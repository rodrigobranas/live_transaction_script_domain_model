import OrderService from "../src/2_hexagonal/2_application";
import { FakeDatabase, ProductionDatabase } from "../src/2_hexagonal/3_resource";

test("Deve fazer um pedido", async function () {
	// const database = new ProductionDatabase();
	const database = new FakeDatabase();
	const orderService = new OrderService(database);
	const inputCheckout = {
		email: "john.doe@gmail.com",
		items: [
			{ productId: 1, quantity: 1 },
			{ productId: 2, quantity: 1 },
			{ productId: 3, quantity: 3 }
		]
	}
	const outputCheckout = await orderService.checkout(inputCheckout);
	expect(outputCheckout.orderId).toBeDefined();
	const outputGetOrder = await orderService.getOrder(outputCheckout.orderId);
	expect(outputGetOrder.email).toBe("john.doe@gmail.com");
	expect(outputGetOrder.total).toBe(6090);
});