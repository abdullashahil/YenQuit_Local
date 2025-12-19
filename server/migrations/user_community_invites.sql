-- Table: public.user_community_invites

-- DROP TABLE IF EXISTS public.user_community_invites;

CREATE TABLE IF NOT EXISTS public.user_community_invites
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    community_id integer NOT NULL,
    inviter_id integer NOT NULL,
    invitee_id integer NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    responded_at timestamp without time zone,
    CONSTRAINT user_community_invites_pkey PRIMARY KEY (id),
    CONSTRAINT user_community_invites_unique UNIQUE (community_id, invitee_id),
    CONSTRAINT user_community_invites_community_fkey FOREIGN KEY (community_id)
        REFERENCES public.communities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_community_invites_invitee_fkey FOREIGN KEY (invitee_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_community_invites_inviter_fkey FOREIGN KEY (inviter_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_community_invites_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying, 'cancelled'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_community_invites
    OWNER to postgres;