create type "public"."service" as enum ('SDWORX', 'FGP');

create type "public"."workplace" as enum ('FIVEGUYS');

create table "public"."credentials" (
    "id" uuid not null default gen_random_uuid(),
    "workplace" workplace not null,
    "service" service not null,
    "username" text not null,
    "password" text not null,
    "user_id" uuid not null
);


create table "public"."stores" (
    "id" uuid not null default gen_random_uuid(),
    "open" time without time zone not null,
    "close" time without time zone not null,
    "workplace" workplace not null,
    "user_id" uuid not null
);


CREATE UNIQUE INDEX credentials_pkey ON public.credentials USING btree (id);

CREATE UNIQUE INDEX stores_pkey ON public.stores USING btree (id);

alter table "public"."credentials" add constraint "credentials_pkey" PRIMARY KEY using index "credentials_pkey";

alter table "public"."stores" add constraint "stores_pkey" PRIMARY KEY using index "stores_pkey";

alter table "public"."credentials" add constraint "credentials_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."credentials" validate constraint "credentials_user_id_fkey";

alter table "public"."stores" add constraint "stores_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."stores" validate constraint "stores_user_id_fkey";

grant delete on table "public"."credentials" to "anon";

grant insert on table "public"."credentials" to "anon";

grant references on table "public"."credentials" to "anon";

grant select on table "public"."credentials" to "anon";

grant trigger on table "public"."credentials" to "anon";

grant truncate on table "public"."credentials" to "anon";

grant update on table "public"."credentials" to "anon";

grant delete on table "public"."credentials" to "authenticated";

grant insert on table "public"."credentials" to "authenticated";

grant references on table "public"."credentials" to "authenticated";

grant select on table "public"."credentials" to "authenticated";

grant trigger on table "public"."credentials" to "authenticated";

grant truncate on table "public"."credentials" to "authenticated";

grant update on table "public"."credentials" to "authenticated";

grant delete on table "public"."credentials" to "service_role";

grant insert on table "public"."credentials" to "service_role";

grant references on table "public"."credentials" to "service_role";

grant select on table "public"."credentials" to "service_role";

grant trigger on table "public"."credentials" to "service_role";

grant truncate on table "public"."credentials" to "service_role";

grant update on table "public"."credentials" to "service_role";

grant delete on table "public"."stores" to "anon";

grant insert on table "public"."stores" to "anon";

grant references on table "public"."stores" to "anon";

grant select on table "public"."stores" to "anon";

grant trigger on table "public"."stores" to "anon";

grant truncate on table "public"."stores" to "anon";

grant update on table "public"."stores" to "anon";

grant delete on table "public"."stores" to "authenticated";

grant insert on table "public"."stores" to "authenticated";

grant references on table "public"."stores" to "authenticated";

grant select on table "public"."stores" to "authenticated";

grant trigger on table "public"."stores" to "authenticated";

grant truncate on table "public"."stores" to "authenticated";

grant update on table "public"."stores" to "authenticated";

grant delete on table "public"."stores" to "service_role";

grant insert on table "public"."stores" to "service_role";

grant references on table "public"."stores" to "service_role";

grant select on table "public"."stores" to "service_role";

grant trigger on table "public"."stores" to "service_role";

grant truncate on table "public"."stores" to "service_role";

grant update on table "public"."stores" to "service_role";


