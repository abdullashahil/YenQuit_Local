-- Table: public.user_5r_progress

-- DROP TABLE IF EXISTS public.user_5r_progress;

CREATE TABLE IF NOT EXISTS public.user_5r_progress
(
    id integer NOT NULL DEFAULT nextval('user_5r_progress_id_seq'::regclass),
    current_step character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT 'relevance'::character varying,
    is_completed boolean DEFAULT false,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    CONSTRAINT user_5r_progress_pkey PRIMARY KEY (id),
    CONSTRAINT user_5r_progress_user_id_key UNIQUE (user_id),
    CONSTRAINT user_5r_progress_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_5r_progress
    OWNER to postgres;

-- Trigger: update_user_5r_progress_updated_at

-- DROP TRIGGER IF EXISTS update_user_5r_progress_updated_at ON public.user_5r_progress;

CREATE OR REPLACE TRIGGER update_user_5r_progress_updated_at
    BEFORE UPDATE 
    ON public.user_5r_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();