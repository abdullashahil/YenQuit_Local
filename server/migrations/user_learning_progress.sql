-- Table: public.user_learning_progress

-- DROP TABLE IF EXISTS public.user_learning_progress;

CREATE TABLE IF NOT EXISTS public.user_learning_progress
(
    id integer NOT NULL DEFAULT nextval('user_learning_progress_id_seq'::regclass),
    content_ids jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    CONSTRAINT user_learning_progress_pkey PRIMARY KEY (id),
    CONSTRAINT user_learning_progress_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_learning_progress
    OWNER to postgres;

-- Trigger: update_user_learning_progress_updated_at

-- DROP TRIGGER IF EXISTS update_user_learning_progress_updated_at ON public.user_learning_progress;

CREATE OR REPLACE TRIGGER update_user_learning_progress_updated_at
    BEFORE UPDATE 
    ON public.user_learning_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();