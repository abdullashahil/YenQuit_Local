-- Table: public.app_resources

-- DROP TABLE IF EXISTS public.app_resources;

CREATE TABLE IF NOT EXISTS public.app_resources
(
    id integer NOT NULL DEFAULT nextval('content_items_id_seq'::regclass),
    type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    icon_name character varying(100) COLLATE pg_catalog."default",
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT content_items_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.app_resources
    OWNER to postgres;
-- Index: idx_app_resources_type

-- DROP INDEX IF EXISTS public.idx_app_resources_type;

CREATE INDEX IF NOT EXISTS idx_app_resources_type
    ON public.app_resources USING btree
    (type COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;