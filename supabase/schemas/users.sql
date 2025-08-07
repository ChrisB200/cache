CREATE TABLE "users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT,
  nickname TEXT,
  auth_user_id UUID NOT NULL,

  FOREIGN KEY ("auth_user_id") REFERENCES auth.users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
