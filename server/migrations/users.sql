-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    role character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT 'user'::character varying,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    status character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT 'active'::character varying,
    onboarding_step integer DEFAULT 0,
    onboarding_completed boolean DEFAULT false,
    full_name character varying(255) COLLATE pg_catalog."default",
    first_name character varying(100) COLLATE pg_catalog."default",
    last_name character varying(100) COLLATE pg_catalog."default",
    phone character varying(50) COLLATE pg_catalog."default",
    age integer,
    gender character varying(50) COLLATE pg_catalog."default",
    bio text COLLATE pg_catalog."default",
    avatar_url text COLLATE pg_catalog."default",
    tobacco_type character varying(50) COLLATE pg_catalog."default",
    addiction_level character varying(50) COLLATE pg_catalog."default",
    fagerstrom_score integer,
    quit_date date,
    join_date timestamp with time zone,
    last_login timestamp with time zone,
    profile_metadata jsonb DEFAULT '{}'::jsonb,
    id integer NOT NULL DEFAULT nextval('users_new_id_seq'::regclass),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role::text = ANY (ARRAY['user'::character varying, 'admin'::character varying, 'co_admin'::character varying]::text[])),
    CONSTRAINT users_status_check CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;