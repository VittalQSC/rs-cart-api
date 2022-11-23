
insert into users(id, name, password) values('111af64e-745b-4948-b6de-399a227c6000', 'VittalQSC', 'TEST_PASSWORD');

insert into carts(id, user_id) values('4444f64e-745b-4948-b6de-399a227c6d12', '111af64e-745b-4948-b6de-399a227c6000');
insert into cart_items(count, product_id, cart_id) values(1, '04f1d188-3d8e-4b64-9c59-8c73e2a779f5', '4444f64e-745b-4948-b6de-399a227c6d12');
insert into cart_items(count, product_id, cart_id) values(2, '67065526-8504-4e6a-9f7e-3605dcbfd512', '4444f64e-745b-4948-b6de-399a227c6d12');
