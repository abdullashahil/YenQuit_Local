-- Table: public.user_notifications

-- DROP TABLE IF EXISTS public.user_notifications;

CREATE TABLE IF NOT EXISTS public.user_notifications
(
    id integer NOT NULL DEFAULT nextval('user_notifications_id_seq'::regclass),
    template_id integer NOT NULL,
    enabled boolean DEFAULT true,
    "time" time without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id integer,
    CONSTRAINT user_notifications_pkey PRIMARY KEY (id),
    CONSTRAINT user_notifications_unique_template UNIQUE (user_id, template_id),
    CONSTRAINT user_notifications_template_id_fkey FOREIGN KEY (template_id)
        REFERENCES public.notification_templates (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_notifications_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_notifications
    OWNER to postgres;