import crypto from "crypto";
import Database from "./3_resource";

export default class OrderService {

	constructor (readonly database: Database) {
	}

	async checkout (input: any) {
		const order = {
			orderId: crypto.randomUUID(),
			email: input.email,
			total: 0
		}
		for (const item of input.items) {
			order.total += await this.addItemToOrder(order.orderId, item);
		}
		if (input.coupon) {
			await this.applyCouponToOrder(order, input.coupon);
		}
		await this.database.saveOrder(order);
		return {
			orderId: order.orderId
		}
	}

	async addItemToOrder (orderId: string, item: any) {
		const productData = await this.database.getProduct(item.productId);
		await this.database.saveItem({ orderId, productId: item.productId, price: parseFloat(productData.price), quantity: item.quantity });
		return parseFloat(productData.price) * item.quantity;
	}

	async applyCouponToOrder (order: any, code: string) {
		const couponData = await this.database.getCoupon(code);
		const today = new Date();
		if (couponData.expire_date.getTime() >= today.getTime()) {
			order.total -= (order.total * parseFloat(couponData.percentage))/100;
		}
	}

	async getOrder (orderId: string) {
		const orderData = await this.database.getOrder(orderId);
		return {
			orderId: orderData.orderId,
			email: orderData.email,
			total: parseFloat(orderData.total)
		}
	}
}
