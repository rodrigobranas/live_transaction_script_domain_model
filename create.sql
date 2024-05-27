drop schema branas cascade;
create schema branas;
create table branas.product (
	product_id integer,
	description text,
	price numeric
);

insert into branas.product (product_id, description, price) values (1, 'A', 1000);
insert into branas.product (product_id, description, price) values (2, 'B', 5000);
insert into branas.product (product_id, description, price) values (3, 'C', 30);

create table branas.coupon (
	code text,
	percentage numeric,
	expire_date timestamp
);

insert into branas.coupon (code, percentage, expire_date) values ('VALE20', 20, '2024-12-01T10:00:00');
insert into branas.coupon (code, percentage, expire_date) values ('VALE20_EXPIRED', 20, '2020-10-01T10:00:00');

create table branas.order (
	order_id uuid,
	coupon_code text,
	email text,
	total numeric
);

create table branas.item (
	order_id uuid,
	product_id integer,
	price numeric,
	quantity integer
);