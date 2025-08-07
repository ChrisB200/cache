CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  open TIME NOT NULL,
  close TIME NOT NULL,
  workplace workplace NOT NULL,
  user_id UUID NOT NULL,

  FOREIGN KEY ("user_id") REFERENCES public.users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
