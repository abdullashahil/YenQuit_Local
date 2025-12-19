-- Table: public.user_coping_strategies

-- DROP TABLE IF EXISTS public.user_coping_strategies;

CREATE TABLE IF NOT EXISTS public.user_coping_strategies
(
    id integer NOT NULL DEFAULT nextval('user_coping_strategies_id_seq'::regclass),
    strategy_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    user_id integer,
    CONSTRAINT user_coping_strategies_pkey PRIMARY KEY (id),
    CONSTRAINT user_coping_strategies_strategy_id_fkey FOREIGN KEY (strategy_id)
        REFERENCES public.app_resources (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_coping_strategies_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_coping_strategies
    OWNER to postgres;