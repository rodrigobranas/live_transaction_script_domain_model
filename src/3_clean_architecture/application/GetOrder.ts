import Database from "../infra/database/CouponRepository";
import OrderRepository from "../infra/database/OrderRepository";

export default class GetOrder {

	constructor (readonly orderRepository: OrderRepository) {
	}

	async execute (orderId: string) {
		const order = await this.orderRepository.getOrder(orderId);
		return {
			orderId: order.orderId,
			email: order.email,
			total: order.getTotal()
		}
	}
}
