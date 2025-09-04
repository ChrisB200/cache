revoke delete on table "public"."shift_histories" from "anon";

revoke insert on table "public"."shift_histories" from "anon";

revoke references on table "public"."shift_histories" from "anon";

revoke select on table "public"."shift_histories" from "anon";

revoke trigger on table "public"."shift_histories" from "anon";

revoke truncate on table "public"."shift_histories" from "anon";

revoke update on table "public"."shift_histories" from "anon";

revoke delete on table "public"."shift_histories" from "authenticated";

revoke insert on table "public"."shift_histories" from "authenticated";

revoke references on table "public"."shift_histories" from "authenticated";

revoke select on table "public"."shift_histories" from "authenticated";

revoke trigger on table "public"."shift_histories" from "authenticated";

revoke truncate on table "public"."shift_histories" from "authenticated";

revoke update on table "public"."shift_histories" from "authenticated";

revoke delete on table "public"."shift_histories" from "service_role";

revoke insert on table "public"."shift_histories" from "service_role";

revoke references on table "public"."shift_histories" from "service_role";

revoke select on table "public"."shift_histories" from "service_role";

revoke trigger on table "public"."shift_histories" from "service_role";

revoke truncate on table "public"."shift_histories" from "service_role";

revoke update on table "public"."shift_histories" from "service_role";

alter table "public"."shift_histories" drop constraint "shift_histories_user_id_fkey";

alter table "public"."shifts" drop constraint "shifts_shift_history_id_fkey";

alter table "public"."shift_histories" drop constraint "shift_histories_pkey";

drop index if exists "public"."shift_histories_pkey";

drop table "public"."shift_histories";

alter table "public"."shifts" drop column "shift_history_id";

alter table "public"."shifts" drop column "status";

alter table "public"."shifts" add column "date" date not null;

alter table "public"."shifts" add column "type" shift_type not null;

alter table "public"."shifts" add column "user_id" uuid not null;

alter table "public"."stores" add column "rate" numeric(10,2) not null;

drop type "public"."shift_status";

alter table "public"."shifts" add constraint "shifts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."shifts" validate constraint "shifts_user_id_fkey";


