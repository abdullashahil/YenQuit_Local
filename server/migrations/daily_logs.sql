-- Table: public.daily_logs

-- DROP TABLE IF EXISTS public.daily_logs;

CREATE TABLE IF NOT EXISTS public.daily_logs
(
    log_date date NOT NULL,
    smoked boolean NOT NULL,
    cigarettes_count integer,
    cravings_level integer,
    mood integer,
    notes text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    id integer NOT NULL DEFAULT nextval('daily_logs_new_id_seq'::regclass),
    user_id integer,
    CONSTRAINT daily_logs_pkey PRIMARY KEY (id),
    CONSTRAINT daily_logs_user_date_unique UNIQUE (user_id, log_date),
    CONSTRAINT daily_logs_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT daily_logs_cigarettes_count_check CHECK (cigarettes_count >= 0),
    CONSTRAINT daily_logs_cravings_level_check CHECK (cravings_level >= 1 AND cravings_level <= 10),
    CONSTRAINT daily_logs_mood_check CHECK (mood >= 1 AND mood <= 10)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.daily_logs
    OWNER to postgres;

-- Trigger: update_daily_logs_updated_at

-- DROP TRIGGER IF EXISTS update_daily_logs_updated_at ON public.daily_logs;

CREATE OR REPLACE TRIGGER update_daily_logs_updated_at
    BEFORE UPDATE 
    ON public.daily_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();