CREATE TABLE bank_institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plaid_institution_id TEXT NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT
)
