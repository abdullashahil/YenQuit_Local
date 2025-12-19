-- Table: public.community_members

-- DROP TABLE IF EXISTS public.community_members;

CREATE TABLE IF NOT EXISTS public.community_members
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    community_id integer NOT NULL,
    user_id integer NOT NULL,
    role character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT 'member'::character varying,
    joined_at timestamp with time zone NOT NULL DEFAULT now(),
    unread_count integer DEFAULT 0,
    last_read_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT community_members_pkey PRIMARY KEY (id),
    CONSTRAINT community_members_unique UNIQUE (community_id, user_id),
    CONSTRAINT community_members_community_fkey FOREIGN KEY (community_id)
        REFERENCES public.communities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT community_members_user_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT community_members_role_check CHECK (role::text = ANY (ARRAY['member'::character varying, 'admin'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.community_members
    OWNER to postgres;