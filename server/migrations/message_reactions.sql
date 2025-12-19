-- Table: public.message_reactions

-- DROP TABLE IF EXISTS public.message_reactions;

CREATE TABLE IF NOT EXISTS public.message_reactions
(
    emoji character varying(50) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id integer NOT NULL DEFAULT nextval('message_reactions_new_id_seq'::regclass),
    message_id integer,
    user_id integer,
    CONSTRAINT message_reactions_pkey PRIMARY KEY (id),
    CONSTRAINT message_reactions_message_id_fkey FOREIGN KEY (message_id)
        REFERENCES public.chat_messages (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT message_reactions_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.message_reactions
    OWNER to postgres;