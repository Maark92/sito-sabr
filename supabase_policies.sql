-- === CREAZIONE TABELLE ===

-- Tabella clienti
create table if not exists clients (
    id serial primary key,
    name text not null,
    email text not null,
    phone text not null
);

-- Tabella appuntamenti
create table if not exists appointments (
    id serial primary key,
    client_name text,
    phone text,
    date date not null,
    time text not null,
    notes text
);

-- Tabella trattamenti
create table if not exists treatments (
    id serial primary key,
    name text not null,
    description text not null,
    price numeric(10,2) not null,
    before_image text,
    after_image text
);

-- Tabella disponibilità
create table if not exists availability (
    id serial primary key,
    date date not null,
    time text not null,
    is_booked boolean default false
);

-- Tabella impostazioni generali
create table if not exists settings (
    key text primary key,
    value text
);

-- === ABILITA RLS SU TUTTE LE TABELLE ===

alter table clients enable row level security;
alter table appointments enable row level security;
alter table treatments enable row level security;
alter table availability enable row level security;
alter table settings enable row level security;

-- === POLICY: SOLO UTENTI AUTENTICATI POSSONO LEGGERE E SCRIVERE ===

-- CLIENTS
create policy "Authenticated can read clients"
    on clients for select
    using (auth.role() = 'authenticated');

create policy "Authenticated can insert clients"
    on clients for insert
    with check (auth.role() = 'authenticated');

create policy "Authenticated can update clients"
    on clients for update
    using (auth.role() = 'authenticated');

create policy "Authenticated can delete clients"
    on clients for delete
    using (auth.role() = 'authenticated');

-- APPOINTMENTS
create policy "Authenticated can read appointments"
    on appointments for select
    using (auth.role() = 'authenticated');

create policy "Authenticated can insert appointments"
    on appointments for insert
    with check (auth.role() = 'authenticated');

create policy "Authenticated can update appointments"
    on appointments for update
    using (auth.role() = 'authenticated');

create policy "Authenticated can delete appointments"
    on appointments for delete
    using (auth.role() = 'authenticated');

-- TREATMENTS
create policy "Authenticated can read treatments"
    on treatments for select
    using (auth.role() = 'authenticated');

create policy "Anyone can read treatments"
    on treatments for select
    using (true);

create policy "Authenticated can insert treatments"
    on treatments for insert
    with check (auth.role() = 'authenticated');

create policy "Authenticated can update treatments"
    on treatments for update
    using (auth.role() = 'authenticated');

create policy "Authenticated can delete treatments"
    on treatments for delete
    using (auth.role() = 'authenticated');

-- AVAILABILITY
create policy "Authenticated can read availability"
    on availability for select
    using (auth.role() = 'authenticated');

create policy "Authenticated can insert availability"
    on availability for insert
    with check (auth.role() = 'authenticated');

create policy "Authenticated can update availability"
    on availability for update
    using (auth.role() = 'authenticated');

create policy "Authenticated can delete availability"
    on availability for delete
    using (auth.role() = 'authenticated');

-- SETTINGS
create policy "Authenticated can read settings"
    on settings for select
    using (auth.role() = 'authenticated');

create policy "Authenticated can insert settings"
    on settings for insert
    with check (auth.role() = 'authenticated');

create policy "Authenticated can update settings"
    on settings for update
    using (auth.role() = 'authenticated');

create policy "Authenticated can delete settings"
    on settings for delete
    using (auth.role() = 'authenticated');
