import pgp from "pg-promise";
import Coupon from "../../domain/Coupon";
import Product from "../../domain/Product";
import Order from "../../domain/Order";

export default interface CouponRepository {
	getCoupon (code: string): Promise<Coupon>;
}

export class CouponRepositoryDatabase implements CouponRepository {
	
	async getCoupon (code: string) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [couponData] = await connection.query("select * from branas.coupon where code = $1", [code]);
		await connection.$pool.end();
		return new Coupon(couponData.code, parseFloat(couponData.percentage), couponData.expire_date);
	}

}
