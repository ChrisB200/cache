CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start TIMESTAMPTZ NOT NULL,
  finish TIMESTAMPTZ NOT NUll,
  category shift_category NOT NULL,
  type shift_type NOT NULL,
  user_id UUID NOT NULL,

  FOREIGN KEY ("user_id") REFERENCES public.users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
