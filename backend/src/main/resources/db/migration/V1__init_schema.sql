create sequence if not exists loan_number_seq start with 1 increment by 1;
create sequence if not exists receipt_number_seq start with 1 increment by 1;
create sequence if not exists customer_code_seq start with 1 increment by 1;

create table app_users (
    id bigserial primary key,
    username varchar(80) not null unique,
    password_hash varchar(255) not null,
    role varchar(40) not null,
    enabled boolean not null default true,
    created_by varchar(120) not null,
    updated_by varchar(120) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create table customers (
    id bigserial primary key,
    customer_code varchar(40) not null unique,
    name varchar(160) not null,
    phone_number varchar(20) not null,
    alternative_phone varchar(20),
    address varchar(500) not null,
    government_id_number varchar(80) not null,
    created_by varchar(120) not null,
    updated_by varchar(120) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create index idx_customers_name on customers (name);
create index idx_customers_phone on customers (phone_number);

create table loans (
    id bigserial primary key,
    loan_number varchar(40) not null unique,
    customer_id bigint not null references customers(id),
    principal_amount numeric(14, 2) not null,
    interest_rate numeric(8, 4) not null,
    interest_type varchar(40) not null,
    interest_payment_frequency varchar(40) not null,
    loan_date date not null,
    closed_date date,
    status varchar(30) not null,
    outstanding_principal numeric(14, 2) not null,
    outstanding_interest numeric(14, 2) not null,
    outstanding_amount numeric(14, 2) not null,
    notes varchar(1000),
    created_by varchar(120) not null,
    updated_by varchar(120) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create index idx_loans_customer on loans (customer_id);
create index idx_loans_status on loans (status);
create index idx_loans_date on loans (loan_date);

create table jewellery_items (
    id bigserial primary key,
    loan_id bigint not null references loans(id) on delete cascade,
    item_type varchar(40) not null,
    description varchar(500) not null,
    weight_grams numeric(10, 3) not null,
    estimated_purity varchar(40) not null,
    estimated_value numeric(14, 2) not null,
    locker_number varchar(80) not null,
    remarks varchar(1000),
    created_by varchar(120) not null,
    updated_by varchar(120) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create index idx_jewellery_locker on jewellery_items (locker_number);

create table jewellery_photos (
    id bigserial primary key,
    jewellery_item_id bigint not null references jewellery_items(id) on delete cascade,
    path varchar(500) not null,
    original_file_name varchar(160) not null,
    content_type varchar(80) not null,
    created_by varchar(120) not null,
    updated_by varchar(120) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create table payments (
    id bigserial primary key,
    loan_id bigint not null references loans(id),
    receipt_number varchar(40) not null unique,
    payment_type varchar(40) not null,
    amount numeric(14, 2) not null,
    principal_component numeric(14, 2) not null,
    interest_component numeric(14, 2) not null,
    payment_date date not null,
    notes varchar(1000),
    created_by varchar(120) not null,
    updated_by varchar(120) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create index idx_payments_loan on payments (loan_id);
create index idx_payments_date on payments (payment_date);

create table bank_loans (
    id bigserial primary key,
    bank_name varchar(160) not null,
    branch varchar(160) not null,
    loan_number varchar(80) not null unique,
    loan_amount numeric(14, 2) not null,
    interest_rate numeric(8, 4) not null,
    start_date date not null,
    renewal_date date not null,
    expiry_date date not null,
    status varchar(40) not null,
    notes varchar(1000),
    created_by varchar(120) not null,
    updated_by varchar(120) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create index idx_bank_loans_renewal on bank_loans (renewal_date);
create index idx_bank_loans_status on bank_loans (status);

create table audit_logs (
    id bigserial primary key,
    action varchar(80) not null,
    entity_name varchar(120) not null,
    entity_id varchar(80),
    details varchar(2000) not null,
    created_by varchar(120) not null,
    updated_by varchar(120) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);
