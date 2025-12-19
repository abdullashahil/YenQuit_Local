-- Table: public.user_relevance_selections

-- DROP TABLE IF EXISTS public.user_relevance_selections;

CREATE TABLE IF NOT EXISTS public.user_relevance_selections
(
    id integer NOT NULL DEFAULT nextval('user_relevance_selections_id_seq'::regclass),
    relevance_option_id integer NOT NULL,
    selected_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    CONSTRAINT user_relevance_selections_pkey PRIMARY KEY (id),
    CONSTRAINT user_relevance_selections_relevance_option_id_fkey FOREIGN KEY (relevance_option_id)
        REFERENCES public.app_resources (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_relevance_selections_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_relevance_selections
    OWNER to postgres;