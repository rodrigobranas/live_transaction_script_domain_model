import pgp from "pg-promise";

export default interface Database {
	getProduct (productId: number): Promise<any>;	
	saveOrder (order: any): Promise<any>;
	getCoupon (code: string): Promise<any>;
	getOrder (orderId: string): Promise<any>;
	saveItem (item: any): Promise<any>;
}

export class ProductionDatabase implements Database {

	async getProduct (productId: number) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [productData] = await connection.query("select * from branas.product where product_id = $1", [productId]);
		await connection.$pool.end();
		return productData;
	}
	
	async saveOrder (order: any) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into branas.order (order_id, email, total) values ($1, $2, $3)", [order.orderId, order.email, order.total]);
		await connection.$pool.end();
	}
	
	async getCoupon (code: string) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [couponData] = await connection.query("select * from branas.coupon where code = $1", [code]);
		await connection.$pool.end();
		return couponData;
	}
	
	async getOrder (orderId: string) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [orderData] = await connection.query("select * from branas.order where order_id = $1", [orderId]);
		await connection.$pool.end();
		return orderData;
	}
	
	async saveItem (item: any) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into branas.item (order_id, product_id, price, quantity) values ($1, $2, $3, $4)", [item.orderId, item.productId, item.price, item.quantity]);
		await connection.$pool.end();
	}

}

export class FakeDatabase implements Database {
	orders: any = [];

	async getProduct(productId: number): Promise<any> {
		const products: any = {
			1: { productId: 1, price: 1000 },
			2: { productId: 2, price: 5000 },
			3: { productId: 3, price: 30 }
		}
		return products[productId];
	}

	async saveOrder(order: any): Promise<any> {
		this.orders.push(order);
	}

	async getCoupon(code: string): Promise<any> {
		const coupons:any = {
			VALE20: { percentage: 20, expire_date: new Date("2024-10-01T10:00:00") },
			VALE20_EXPIRED: { percentage: 20, expire_date: new Date("2020-03-01T10:00:00") }
		}
		return coupons[code];
	}

	async getOrder(orderId: string): Promise<any> {
		const order = this.orders.find((order: any) => order.orderId === orderId);
		return order;
	}

	async saveItem(item: any): Promise<any> {
	}
}
