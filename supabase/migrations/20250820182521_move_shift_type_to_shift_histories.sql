alter table "public"."shift_histories" add column "type" shift_type not null;

alter table "public"."shifts" drop column "type";


