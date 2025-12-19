-- Table: public.chat_messages

-- DROP TABLE IF EXISTS public.chat_messages;

CREATE TABLE IF NOT EXISTS public.chat_messages
(
    content text COLLATE pg_catalog."default" NOT NULL,
    message_type character varying(20) COLLATE pg_catalog."default" DEFAULT 'text'::character varying,
    file_url character varying(500) COLLATE pg_catalog."default",
    is_edited boolean DEFAULT false,
    edited_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id integer NOT NULL DEFAULT nextval('chat_messages_new_id_seq'::regclass),
    community_id integer,
    user_id integer,
    reply_to integer,
    CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
    CONSTRAINT chat_messages_community_id_fkey FOREIGN KEY (community_id)
        REFERENCES public.communities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT chat_messages_reply_to_fkey FOREIGN KEY (reply_to)
        REFERENCES public.chat_messages (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT chat_messages_message_type_check CHECK (message_type::text = ANY (ARRAY['text'::character varying, 'image'::character varying, 'file'::character varying, 'system'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat_messages
    OWNER to postgres;
-- Index: idx_chat_messages_created_at

-- DROP INDEX IF EXISTS public.idx_chat_messages_created_at;

CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
    ON public.chat_messages USING btree
    (created_at ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;