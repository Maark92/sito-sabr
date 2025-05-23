-- Rimuovi prima le policy esistenti per appointments
drop policy if exists "Authenticated can read appointments" on appointments;
drop policy if exists "Anyone can read appointments" on appointments;
drop policy if exists "Authenticated can insert appointments" on appointments;
drop policy if exists "Authenticated can update appointments" on appointments;
drop policy if exists "Authenticated can delete appointments" on appointments;

-- Aggiungi le nuove policy per appointments
-- Chiunque può leggere gli appuntamenti
create policy "Anyone can read appointments"
    on appointments for select
    using (true);

-- Chiunque può inserire appuntamenti (per le prenotazioni pubbliche)
create policy "Anyone can insert appointments"
    on appointments for insert
    with check (true);

-- Solo gli autenticati possono modificare o eliminare
create policy "Only authenticated can update appointments"
    on appointments for update
    using (auth.role() = 'authenticated');

create policy "Only authenticated can delete appointments"
    on appointments for delete
    using (auth.role() = 'authenticated');