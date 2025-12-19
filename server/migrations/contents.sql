-- Table: public.contents

-- DROP TABLE IF EXISTS public.contents;

CREATE TABLE IF NOT EXISTS public.contents
(
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    category character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    content text COLLATE pg_catalog."default" NOT NULL,
    status character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Draft'::character varying,
    publish_date date,
    end_date date,
    media_url text COLLATE pg_catalog."default",
    tags text[] COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    id integer NOT NULL DEFAULT nextval('contents_new_id_seq'::regclass),
    CONSTRAINT contents_pkey PRIMARY KEY (id),
    CONSTRAINT contents_category_check CHECK (category::text = ANY (ARRAY['Blog'::character varying, 'Quote'::character varying, 'Campaign'::character varying, 'Video'::character varying, 'Podcast'::character varying, 'Image'::character varying]::text[])),
    CONSTRAINT contents_status_check CHECK (status::text = ANY (ARRAY['Draft'::character varying, 'Pending'::character varying, 'Live'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contents
    OWNER to postgres;
-- Index: idx_contents_category

-- DROP INDEX IF EXISTS public.idx_contents_category;

CREATE INDEX IF NOT EXISTS idx_contents_category
    ON public.contents USING btree
    (category COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_contents_created_at

-- DROP INDEX IF EXISTS public.idx_contents_created_at;

CREATE INDEX IF NOT EXISTS idx_contents_created_at
    ON public.contents USING btree
    (created_at ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_contents_publish_date

-- DROP INDEX IF EXISTS public.idx_contents_publish_date;

CREATE INDEX IF NOT EXISTS idx_contents_publish_date
    ON public.contents USING btree
    (publish_date ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_contents_status

-- DROP INDEX IF EXISTS public.idx_contents_status;

CREATE INDEX IF NOT EXISTS idx_contents_status
    ON public.contents USING btree
    (status COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_contents_title

-- DROP INDEX IF EXISTS public.idx_contents_title;

CREATE INDEX IF NOT EXISTS idx_contents_title
    ON public.contents USING gin
    (to_tsvector('english'::regconfig, title::text))
    WITH (fastupdate=True, gin_pending_list_limit=4194304)
    TABLESPACE pg_default;

-- Trigger: update_contents_updated_at

-- DROP TRIGGER IF EXISTS update_contents_updated_at ON public.contents;

CREATE OR REPLACE TRIGGER update_contents_updated_at
    BEFORE UPDATE 
    ON public.contents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();