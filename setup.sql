-- Elimina la tabella "settings" se esiste
DROP TABLE IF EXISTS settings;

-- Crea la tabella "settings" per gestire le configurazioni del sito
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Inserisci un valore iniziale per l'immagine di sfondo
INSERT INTO settings (key, value)
VALUES ('background_image', 'https://example.com/default-background.jpg')
ON CONFLICT (key) DO NOTHING;

-- Disabilita Row-Level Security (RLS) per entrambe le tabelle
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;

-- Rimuovi tutte le policy esistenti
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON settings;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON settings;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON gallery;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON gallery;

-- Crea i bucket di storage per "backgrounds" e "gallery"
-- Nota: Questo comando deve essere eseguito manualmente nella dashboard di Supabase
-- Vai su Storage > Buckets e crea i seguenti bucket:
-- 1. Nome del bucket: backgrounds (impostalo come pubblico)
-- 2. Nome del bucket: gallery (impostalo come pubblico)

-- Configura le regole di accesso pubblico per i bucket
-- Nota: Questo deve essere fatto manualmente nella dashboard di Supabase
-- Vai su Storage > Buckets > backgrounds > Policies e aggiungi questa regola:
--   allow read, write on objects in bucket backgrounds for authenticated users
-- Fai lo stesso per il bucket "gallery".

-- Verifica che la tabella sia accessibile
SELECT * FROM settings;
