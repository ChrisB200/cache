CREATE TABLE "users" (
  id UUID PRIMARY KEY NOT NULL,
  username TEXT,
  nickname TEXT,

  FOREIGN KEY ("id") REFERENCES auth.users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
