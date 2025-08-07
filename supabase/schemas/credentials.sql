CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workplace workplace NOT NULL,
  service service NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  user_id UUID NOT NULL,

  FOREIGN KEY ("user_id") REFERENCES public.users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
