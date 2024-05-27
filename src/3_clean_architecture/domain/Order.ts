import Item from "./Item";
import crypto from "crypto";
import Product from "./Product";
import Coupon from "./Coupon";
import Email from "./Email";

export default class Order {
	items: Item[];
	coupon?: Coupon;

	constructor (readonly orderId: string, readonly email: Email) {
		this.items = [];
	}
	
	static create (email: string) {
		const orderId = crypto.randomUUID();
		return new Order(orderId, new Email(email));
	}

	addItem (product: Product, quantity: number) {
		this.items.push(new Item(this.orderId, product.productId, product.price, quantity));
	}

	applyCoupon (coupon: Coupon) {
		if (!coupon.isExpired()) {
			this.coupon = coupon;
		}
	}

	getTotal () {
		let total = 0;
		for (const item of this.items) {
			total += item.getTotal();
		}
		if (this.coupon) {
			total -= this.coupon.getDiscountAmount(total);
		}
		return total;
	}
}
