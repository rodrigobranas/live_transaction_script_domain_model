import pgp from "pg-promise";
import Coupon from "../../domain/Coupon";
import Product from "../../domain/Product";
import Order from "../../domain/Order";

export default interface ProductRepository {
	getProduct (productId: number): Promise<Product>;
}

export class ProductRepositoryDatabase implements ProductRepository {

	async getProduct (productId: number) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [productData] = await connection.query("select * from branas.product where product_id = $1", [productId]);
		await connection.$pool.end();
		return new Product(productData.product_id, productData.description, parseFloat(productData.price));
	}
	
	async saveOrder (order: Order) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into branas.order (order_id, email, total) values ($1, $2, $3)", [order.orderId, order.email, order.getTotal()]);
		await connection.$pool.end();
	}

}
