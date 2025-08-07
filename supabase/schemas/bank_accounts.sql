CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plaid_account_id TEXT NOT NULL,
  name TEXT NOT NULL,
  nickname TEXT,
  type plaid_account_type NOT NULL,
  subtype plaid_account_subtype NOT NULL,
  balance NUMERIC(10, 2) DEFAULT 0,
  bank_item_id UUID NOT NULL,
  position INTEGER NOT NULL,

  FOREIGN KEY ("bank_item_id") REFERENCES public.bank_items(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
)
