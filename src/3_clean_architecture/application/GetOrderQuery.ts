import pgp from "pg-promise";

// Query Model
export default class GetOrderQuery {

	constructor () {
	}

	async execute (orderId: string) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [orderData] = await connection.query("select * from branas.order where order_id = $1", [orderId]);
		await connection.$pool.end();
		return {
			orderId: orderData.orderId,
			email: orderData.email,
			total: parseFloat(orderData.total)
		}
	}
}