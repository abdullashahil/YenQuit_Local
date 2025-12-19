-- Table: public.fivea_assist_plans

-- DROP TABLE IF EXISTS public.fivea_assist_plans;

CREATE TABLE IF NOT EXISTS public.fivea_assist_plans
(
    id integer NOT NULL DEFAULT nextval('fivea_assist_plans_id_seq'::regclass),
    quit_date date,
    triggers text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id integer,
    CONSTRAINT fivea_assist_plans_pkey PRIMARY KEY (id),
    CONSTRAINT fivea_assist_plans_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.fivea_assist_plans
    OWNER to postgres;