-- Table: public.communities

-- DROP TABLE IF EXISTS public.communities;

CREATE TABLE IF NOT EXISTS public.communities
(
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    avatar_url character varying(500) COLLATE pg_catalog."default",
    is_private boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id integer NOT NULL DEFAULT nextval('communities_new_id_seq'::regclass),
    created_by integer,
    CONSTRAINT communities_pkey PRIMARY KEY (id),
    CONSTRAINT communities_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.communities
    OWNER to postgres;
-- Index: idx_communities_created_at

-- DROP INDEX IF EXISTS public.idx_communities_created_at;

CREATE INDEX IF NOT EXISTS idx_communities_created_at
    ON public.communities USING btree
    (created_at ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Trigger: update_communities_updated_at

-- DROP TRIGGER IF EXISTS update_communities_updated_at ON public.communities;

CREATE OR REPLACE TRIGGER update_communities_updated_at
    BEFORE UPDATE 
    ON public.communities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();