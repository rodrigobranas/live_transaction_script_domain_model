export default class Email {
	value: string;

	constructor (email: string) {
		if (!this.isValid(email)) throw new Error("Invald email");
		this.value = email;
	}

	isValid (email: string) {
		return true;
	}
}