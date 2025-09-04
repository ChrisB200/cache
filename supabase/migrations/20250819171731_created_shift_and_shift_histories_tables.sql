create type "public"."shift_category" as enum ('work', 'holiday');

create type "public"."shift_status" as enum ('active', 'removed', 'cancelled');

create type "public"."shift_type" as enum ('timecard', 'schedule');

create table "public"."shift_histories" (
    "id" uuid not null default gen_random_uuid(),
    "date" date not null,
    "user_id" uuid not null
);


create table "public"."shifts" (
    "id" uuid not null default gen_random_uuid(),
    "start" timestamp with time zone not null,
    "finish" timestamp with time zone not null,
    "type" shift_type not null,
    "category" shift_category not null,
    "status" shift_status not null,
    "shift_history_id" uuid not null
);


CREATE UNIQUE INDEX shift_histories_pkey ON public.shift_histories USING btree (id);

CREATE UNIQUE INDEX shifts_pkey ON public.shifts USING btree (id);

alter table "public"."shift_histories" add constraint "shift_histories_pkey" PRIMARY KEY using index "shift_histories_pkey";

alter table "public"."shifts" add constraint "shifts_pkey" PRIMARY KEY using index "shifts_pkey";

alter table "public"."shift_histories" add constraint "shift_histories_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."shift_histories" validate constraint "shift_histories_user_id_fkey";

alter table "public"."shifts" add constraint "shifts_shift_history_id_fkey" FOREIGN KEY (shift_history_id) REFERENCES shift_histories(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."shifts" validate constraint "shifts_shift_history_id_fkey";

grant delete on table "public"."shift_histories" to "anon";

grant insert on table "public"."shift_histories" to "anon";

grant references on table "public"."shift_histories" to "anon";

grant select on table "public"."shift_histories" to "anon";

grant trigger on table "public"."shift_histories" to "anon";

grant truncate on table "public"."shift_histories" to "anon";

grant update on table "public"."shift_histories" to "anon";

grant delete on table "public"."shift_histories" to "authenticated";

grant insert on table "public"."shift_histories" to "authenticated";

grant references on table "public"."shift_histories" to "authenticated";

grant select on table "public"."shift_histories" to "authenticated";

grant trigger on table "public"."shift_histories" to "authenticated";

grant truncate on table "public"."shift_histories" to "authenticated";

grant update on table "public"."shift_histories" to "authenticated";

grant delete on table "public"."shift_histories" to "service_role";

grant insert on table "public"."shift_histories" to "service_role";

grant references on table "public"."shift_histories" to "service_role";

grant select on table "public"."shift_histories" to "service_role";

grant trigger on table "public"."shift_histories" to "service_role";

grant truncate on table "public"."shift_histories" to "service_role";

grant update on table "public"."shift_histories" to "service_role";

grant delete on table "public"."shifts" to "anon";

grant insert on table "public"."shifts" to "anon";

grant references on table "public"."shifts" to "anon";

grant select on table "public"."shifts" to "anon";

grant trigger on table "public"."shifts" to "anon";

grant truncate on table "public"."shifts" to "anon";

grant update on table "public"."shifts" to "anon";

grant delete on table "public"."shifts" to "authenticated";

grant insert on table "public"."shifts" to "authenticated";

grant references on table "public"."shifts" to "authenticated";

grant select on table "public"."shifts" to "authenticated";

grant trigger on table "public"."shifts" to "authenticated";

grant truncate on table "public"."shifts" to "authenticated";

grant update on table "public"."shifts" to "authenticated";

grant delete on table "public"."shifts" to "service_role";

grant insert on table "public"."shifts" to "service_role";

grant references on table "public"."shifts" to "service_role";

grant select on table "public"."shifts" to "service_role";

grant trigger on table "public"."shifts" to "service_role";

grant truncate on table "public"."shifts" to "service_role";

grant update on table "public"."shifts" to "service_role";


