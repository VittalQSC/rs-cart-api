drop table if exists order_items, order_status_histories, orders;
drop table if exists carts, cart_items, carts_cart_items, users;

create extension if not exists "uuid-ossp";

create table users (
	id uuid not null default uuid_generate_v4() primary key,
	name text not null,
	password text not null
);

create table carts (
	id uuid not null default uuid_generate_v4() primary key,
	user_id uuid not null,
	created_at date not null default now(),
	updated_at date not null default now(),
	constraint fk_user foreign key(user_id) references users(id)
);

create table cart_items (
	product_id uuid not null,
	count int not null
);

alter table cart_items add column cart_id uuid references carts(id) on delete cascade;
alter table cart_items add constraint pk_product_id_cart_id primary key(product_id, cart_id);

create table orders (
	id uuid not null unique default uuid_generate_v4() primary key,
	address text not null,
	first_name text not null,
	last_name text not null
);

create table order_items (
	product_id uuid not null,
	count int not null
);
alter table order_items add column order_id uuid references orders(id) on delete cascade;
alter table order_items add constraint pk_product_id_order_id primary key(product_id, order_id);

create table order_status_histories (
	id uuid not null unique default uuid_generate_v4() primary key,
	order_id uuid not null references orders(id) on delete cascade,
	timestamp date not null default current_timestamp,
	status text not null,
	comment text not null
);
