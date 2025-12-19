-- Table: public.community_invites

-- DROP TABLE IF EXISTS public.community_invites;

CREATE TABLE IF NOT EXISTS public.community_invites
(
    id integer NOT NULL DEFAULT nextval('community_invites_id_seq'::regclass),
    code character varying(10) COLLATE pg_catalog."default" NOT NULL,
    community_id integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp without time zone,
    max_uses integer DEFAULT 1,
    used_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    CONSTRAINT community_invites_pkey PRIMARY KEY (id),
    CONSTRAINT community_invites_code_key UNIQUE (code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.community_invites
    OWNER to postgres;