export default class Item {

	constructor (readonly orderId: string, readonly productId: number, readonly price: number, readonly quantity: number) {
	}

	getTotal () {
		return this.price * this.quantity;
	}
}
