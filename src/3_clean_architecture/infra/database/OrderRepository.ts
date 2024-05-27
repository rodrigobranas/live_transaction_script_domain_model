import pgp from "pg-promise";
import Coupon from "../../domain/Coupon";
import Product from "../../domain/Product";
import Order from "../../domain/Order";
import Item from "../../domain/Item";
import Email from "../../domain/Email";

export default interface OrderRepository {
	saveOrder (order: Order): Promise<void>;
	getOrder (orderId: string): Promise<Order>;
}

export class OrderRepositoryDatabase implements OrderRepository {
	
	async saveOrder (order: Order) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into branas.order (order_id, coupon_code, email, total) values ($1, $2, $3, $4)", [order.orderId, order.coupon?.code, order.email.value, order.getTotal()]);
		for (const item of order.items) {
			await connection.query("insert into branas.item (order_id, product_id, price, quantity) values ($1, $2, $3, $4)", [item.orderId, item.productId, item.price, item.quantity]);
		}
		await connection.$pool.end();
	}
	
	async getOrder (orderId: string) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [orderData] = await connection.query("select * from branas.order where order_id = $1", [orderId]);
		const itemsData = await connection.query("select * from branas.item where order_id = $1", [orderId]);
		const [couponData] = await connection.query("select * from branas.coupon where code = $1", [orderData.coupon_code]);
		await connection.$pool.end();
		const order = new Order(orderData.order_id, new Email(orderData.email));
		const items = [];
		for (const itemData of itemsData) {
			const item = new Item(itemData.order_id, itemData.product_id, parseFloat(itemData.price), itemData.quantity);
			items.push(item);
		}
		order.items = items;
		if (couponData) order.coupon = new Coupon(couponData.code, parseFloat(couponData.percentage), couponData.expire_date);
		return order;
	}

}
