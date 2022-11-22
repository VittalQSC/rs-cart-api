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
	user_id uuid not null,
	cart_id uuid not null,
	payment JSON not null,
	delivery JSON not null,
	comments text,
	status text not null,
	constraint orders_pkey primary key (user_id, cart_id)
);