-- Table: public.fivea_history

-- DROP TABLE IF EXISTS public.fivea_history;

CREATE TABLE IF NOT EXISTS public.fivea_history
(
    stage character varying(50) COLLATE pg_catalog."default" NOT NULL,
    history_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    id integer NOT NULL DEFAULT nextval('fivea_history_new_id_seq'::regclass),
    user_id integer,
    CONSTRAINT fivea_history_pkey PRIMARY KEY (id),
    CONSTRAINT fivea_history_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.fivea_history
    OWNER to postgres;
-- Index: idx_fivea_history_stage

-- DROP INDEX IF EXISTS public.idx_fivea_history_stage;

CREATE INDEX IF NOT EXISTS idx_fivea_history_stage
    ON public.fivea_history USING btree
    (stage COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;