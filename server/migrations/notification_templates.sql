-- Table: public.notification_templates

-- DROP TABLE IF EXISTS public.notification_templates;

CREATE TABLE IF NOT EXISTS public.notification_templates
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    key text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default",
    default_time time without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT notification_templates_pkey PRIMARY KEY (id),
    CONSTRAINT notification_templates_key_key UNIQUE (key)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notification_templates
    OWNER to postgres;