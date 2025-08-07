CREATE TABLE bank_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plaid_item_id TEXT NOT NULL,
  plaid_access_token TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT Now(),
  bank_institution_id UUID NOT NULL,
  expired BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL,

  FOREIGN KEY ("bank_institution_id") REFERENCES public.bank_institutions(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  FOREIGN KEY ("user_id") REFERENCES public.users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
