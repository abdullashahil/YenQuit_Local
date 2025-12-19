-- Table: public.user_chat_logs

-- DROP TABLE IF EXISTS public.user_chat_logs;

CREATE TABLE IF NOT EXISTS public.user_chat_logs
(
    chat_date date NOT NULL,
    messages jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    id integer NOT NULL DEFAULT nextval('user_chat_logs_new_id_seq'::regclass),
    user_id integer,
    CONSTRAINT user_chat_logs_pkey PRIMARY KEY (id),
    CONSTRAINT user_chat_logs_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_chat_logs
    OWNER to postgres;

COMMENT ON TABLE public.user_chat_logs
    IS 'Stores daily chat messages for users in JSONB format for efficient storage and retrieval';

COMMENT ON COLUMN public.user_chat_logs.chat_date
    IS 'Date of the chat messages (one row per user per day)';

COMMENT ON COLUMN public.user_chat_logs.messages
    IS 'Example: [{"role": "user", "content": "hello"}, {"role": "assistant", "content": "hi there"}]';
-- Index: idx_user_chat_logs_chat_date

-- DROP INDEX IF EXISTS public.idx_user_chat_logs_chat_date;

CREATE INDEX IF NOT EXISTS idx_user_chat_logs_chat_date
    ON public.user_chat_logs USING btree
    (chat_date ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_user_chat_logs_messages_gin

-- DROP INDEX IF EXISTS public.idx_user_chat_logs_messages_gin;

CREATE INDEX IF NOT EXISTS idx_user_chat_logs_messages_gin
    ON public.user_chat_logs USING gin
    (messages)
    WITH (fastupdate=True, gin_pending_list_limit=4194304)
    TABLESPACE pg_default;

-- Trigger: update_user_chat_logs_updated_at

-- DROP TRIGGER IF EXISTS update_user_chat_logs_updated_at ON public.user_chat_logs;

CREATE OR REPLACE TRIGGER update_user_chat_logs_updated_at
    BEFORE UPDATE 
    ON public.user_chat_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();