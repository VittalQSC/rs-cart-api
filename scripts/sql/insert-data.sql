
insert into users(id, name, password) values('111af64e-745b-4948-b6de-399a227c6000', 'VittalQSC', 'TEST_PASSWORD');

insert into carts(id, user_id) values('4444f64e-745b-4948-b6de-399a227c6d12', '111af64e-745b-4948-b6de-399a227c6000');
insert into cart_items(count, product_id, cart_id) values(1, '04f1d188-3d8e-4b64-9c59-8c73e2a779f5', '4444f64e-745b-4948-b6de-399a227c6d12');
insert into cart_items(count, product_id, cart_id) values(2, '67065526-8504-4e6a-9f7e-3605dcbfd512', '4444f64e-745b-4948-b6de-399a227c6d12');

insert into users(id, name, password) values('200af64e-745b-4948-b6de-399a227c6d13', 'Vitali', 'TEST_PASSWORD');
insert into users(id, name, password) values('400af64e-745b-4948-b6de-399a227c6d44', 'Ivan', 'TEST_PASSWORD2');
insert into users(id, name, password) values('800af64e-745b-4948-b6de-399a227c6888', 'Yana', 'TEST_PASSWORD3');

insert into carts(id, user_id) values('600af64e-745b-4948-b6de-399a227c6d12', '200af64e-745b-4948-b6de-399a227c6d13');
insert into carts(id, user_id) values('e4b4c4ff-42a7-4437-9e74-5b39ff20fd80', '400af64e-745b-4948-b6de-399a227c6d44');
insert into carts(id, user_id) values('22fde06f-9306-4186-89cc-266c0c202e52', '800af64e-745b-4948-b6de-399a227c6888');

insert into cart_items(count, product_id, cart_id) values(1, '04f1d188-3d8e-4b64-9c59-8c73e2a779f5', '600af64e-745b-4948-b6de-399a227c6d12');
insert into cart_items(count, product_id, cart_id) values(2, '67065526-8504-4e6a-9f7e-3605dcbfd512', '600af64e-745b-4948-b6de-399a227c6d12');
