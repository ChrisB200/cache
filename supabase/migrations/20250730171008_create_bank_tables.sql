create type "public"."plaid_account_subtype" as enum ('checking', 'savings', 'hsa', 'cd', 'money market', 'paypal', 'prepaid', 'cash management', 'ebt', 'credit card', 'line of credit', 'auto', 'business', 'commercial', 'construction', 'consumer', 'home equity', 'loan', 'mortgage', 'student', '401a', '401k', '403B', '457b', '529', 'brokerage', 'ira', 'roth', 'roth 401k', 'sep ira', 'simple ira', 'keogh', 'mutual fund', 'lira', 'lrif', 'lrsp', 'lif', 'rlif', 'rrsp', 'rrif', 'sarsep', 'tfsa', 'ugma', 'utma', 'stock plan', 'thrift savings plan', 'variable annuity', 'fixed annuity', 'gic', 'prif', 'rdsp', 'resp', 'isa', 'education savings account', 'payroll', 'crypto exchange', 'non-custodial wallet', 'other annuity', 'life insurance', 'other insurance', 'non-taxable brokerage account', 'retirement', 'trust', 'cash isa', 'other');

create type "public"."plaid_account_type" as enum ('depository', 'credit', 'loan', 'investment', 'other');

create table "public"."bank_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "plaid_account_id" text not null,
    "name" text not null,
    "nickname" text,
    "type" plaid_account_type not null,
    "subtype" plaid_account_subtype not null,
    "balance" numeric(10,2) default 0,
    "bank_item_id" uuid not null,
    "position" integer not null
);


create table "public"."bank_institutions" (
    "id" uuid not null default gen_random_uuid(),
    "plaid_institution_id" text not null,
    "name" text not null,
    "logo_url" text not null
);


create table "public"."bank_items" (
    "id" uuid not null default gen_random_uuid(),
    "plaid_item_id" text not null,
    "plaid_access_token" text not null,
    "updated_at" timestamp with time zone default now(),
    "bank_institution_id" uuid not null,
    "expired" boolean default false,
    "user_id" uuid not null
);


CREATE UNIQUE INDEX bank_accounts_pkey ON public.bank_accounts USING btree (id);

CREATE UNIQUE INDEX bank_institutions_pkey ON public.bank_institutions USING btree (id);

CREATE UNIQUE INDEX bank_items_pkey ON public.bank_items USING btree (id);

alter table "public"."bank_accounts" add constraint "bank_accounts_pkey" PRIMARY KEY using index "bank_accounts_pkey";

alter table "public"."bank_institutions" add constraint "bank_institutions_pkey" PRIMARY KEY using index "bank_institutions_pkey";

alter table "public"."bank_items" add constraint "bank_items_pkey" PRIMARY KEY using index "bank_items_pkey";

alter table "public"."bank_accounts" add constraint "bank_accounts_bank_item_id_fkey" FOREIGN KEY (bank_item_id) REFERENCES bank_items(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."bank_accounts" validate constraint "bank_accounts_bank_item_id_fkey";

alter table "public"."bank_items" add constraint "bank_items_bank_institution_id_fkey" FOREIGN KEY (bank_institution_id) REFERENCES bank_institutions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bank_items" validate constraint "bank_items_bank_institution_id_fkey";

alter table "public"."bank_items" add constraint "bank_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bank_items" validate constraint "bank_items_user_id_fkey";

grant delete on table "public"."bank_accounts" to "anon";

grant insert on table "public"."bank_accounts" to "anon";

grant references on table "public"."bank_accounts" to "anon";

grant select on table "public"."bank_accounts" to "anon";

grant trigger on table "public"."bank_accounts" to "anon";

grant truncate on table "public"."bank_accounts" to "anon";

grant update on table "public"."bank_accounts" to "anon";

grant delete on table "public"."bank_accounts" to "authenticated";

grant insert on table "public"."bank_accounts" to "authenticated";

grant references on table "public"."bank_accounts" to "authenticated";

grant select on table "public"."bank_accounts" to "authenticated";

grant trigger on table "public"."bank_accounts" to "authenticated";

grant truncate on table "public"."bank_accounts" to "authenticated";

grant update on table "public"."bank_accounts" to "authenticated";

grant delete on table "public"."bank_accounts" to "service_role";

grant insert on table "public"."bank_accounts" to "service_role";

grant references on table "public"."bank_accounts" to "service_role";

grant select on table "public"."bank_accounts" to "service_role";

grant trigger on table "public"."bank_accounts" to "service_role";

grant truncate on table "public"."bank_accounts" to "service_role";

grant update on table "public"."bank_accounts" to "service_role";

grant delete on table "public"."bank_institutions" to "anon";

grant insert on table "public"."bank_institutions" to "anon";

grant references on table "public"."bank_institutions" to "anon";

grant select on table "public"."bank_institutions" to "anon";

grant trigger on table "public"."bank_institutions" to "anon";

grant truncate on table "public"."bank_institutions" to "anon";

grant update on table "public"."bank_institutions" to "anon";

grant delete on table "public"."bank_institutions" to "authenticated";

grant insert on table "public"."bank_institutions" to "authenticated";

grant references on table "public"."bank_institutions" to "authenticated";

grant select on table "public"."bank_institutions" to "authenticated";

grant trigger on table "public"."bank_institutions" to "authenticated";

grant truncate on table "public"."bank_institutions" to "authenticated";

grant update on table "public"."bank_institutions" to "authenticated";

grant delete on table "public"."bank_institutions" to "service_role";

grant insert on table "public"."bank_institutions" to "service_role";

grant references on table "public"."bank_institutions" to "service_role";

grant select on table "public"."bank_institutions" to "service_role";

grant trigger on table "public"."bank_institutions" to "service_role";

grant truncate on table "public"."bank_institutions" to "service_role";

grant update on table "public"."bank_institutions" to "service_role";

grant delete on table "public"."bank_items" to "anon";

grant insert on table "public"."bank_items" to "anon";

grant references on table "public"."bank_items" to "anon";

grant select on table "public"."bank_items" to "anon";

grant trigger on table "public"."bank_items" to "anon";

grant truncate on table "public"."bank_items" to "anon";

grant update on table "public"."bank_items" to "anon";

grant delete on table "public"."bank_items" to "authenticated";

grant insert on table "public"."bank_items" to "authenticated";

grant references on table "public"."bank_items" to "authenticated";

grant select on table "public"."bank_items" to "authenticated";

grant trigger on table "public"."bank_items" to "authenticated";

grant truncate on table "public"."bank_items" to "authenticated";

grant update on table "public"."bank_items" to "authenticated";

grant delete on table "public"."bank_items" to "service_role";

grant insert on table "public"."bank_items" to "service_role";

grant references on table "public"."bank_items" to "service_role";

grant select on table "public"."bank_items" to "service_role";

grant trigger on table "public"."bank_items" to "service_role";

grant truncate on table "public"."bank_items" to "service_role";

grant update on table "public"."bank_items" to "service_role";


