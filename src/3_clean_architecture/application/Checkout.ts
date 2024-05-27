import crypto from "crypto";
import Database from "../infra/database/CouponRepository";
import Order from "../domain/Order";
import OrderRepository from "../infra/database/OrderRepository";
import CouponRepository from "../infra/database/CouponRepository";
import ProductRepository from "../infra/database/ProductRepository";

// Command Model
export default class Checkout {

	constructor (readonly orderRepository: OrderRepository, readonly couponRepository: CouponRepository, readonly productRepository: ProductRepository) {
	}

	async execute (input: any) {
		const order = Order.create(input.email);
		for (const item of input.items) {
			const product = await this.productRepository.getProduct(item.productId);
			order.addItem(product, item.quantity);
		}
		if (input.coupon) {
			const coupon = await this.couponRepository.getCoupon(input.coupon);
			order.applyCoupon(coupon);
		}
		await this.orderRepository.saveOrder(order);
		return {
			orderId: order.orderId
		}
	}

}
