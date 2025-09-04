alter table "public"."users" drop constraint "users_auth_user_id_fkey";

drop function if exists "public"."handle_new_user"();

alter table "public"."users" drop column "auth_user_id";

alter table "public"."users" alter column "id" drop default;

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";


