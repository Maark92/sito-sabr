-- Elimina la tabella appointments se esiste
DROP TABLE IF EXISTS appointments CASCADE;

-- Ricrea la tabella appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY, -- ID univoco per ogni appuntamento
    client_name TEXT NOT NULL, -- Nome del cliente
    phone TEXT NOT NULL, -- Telefono del cliente
    treatment_id INTEGER NOT NULL REFERENCES treatments(id) ON DELETE CASCADE, -- ID del trattamento (FK verso treatments)
    date DATE NOT NULL, -- Data dell'appuntamento
    time TIME NOT NULL, -- Orario dell'appuntamento
    created_at TIMESTAMP DEFAULT NOW() -- Timestamp di creazione
);

-- Aggiungi una restrizione unica per evitare duplicati di date e orari
ALTER TABLE appointments ADD CONSTRAINT unique_date_time UNIQUE (date, time);

-- Abilita la replica per la tabella appointments
ALTER TABLE appointments REPLICA IDENTITY FULL;

-- Crea una policy per consentire l'inserimento di appuntamenti
CREATE POLICY insert_appointments ON appointments
    FOR INSERT
    WITH CHECK (true);

-- Crea una policy per consentire la selezione degli appuntamenti
CREATE POLICY select_appointments ON appointments
    FOR SELECT
    USING (true);

-- Applica le policy alla tabella
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Concedi i permessi necessari al ruolo anonimo (se richiesto)
GRANT SELECT, INSERT, DELETE ON appointments TO anon;
