alter table "public"."shifts" add column "hours" numeric generated always as ((EXTRACT(epoch FROM (finish - start)) / (3600)::numeric)) stored;

alter table "public"."shifts" add column "rate" numeric(10,2) not null;


