-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    role character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT 'user'::character varying,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    onboarding_step integer DEFAULT 0,
    onboarding_completed boolean DEFAULT false,
    full_name character varying(255) COLLATE pg_catalog."default",
    phone character varying(50) COLLATE pg_catalog."default",
    age integer,
    gender character varying(50) COLLATE pg_catalog."default",
    tobacco_type character varying(50) COLLATE pg_catalog."default",
    fagerstrom_score integer,
    quit_date date,
    join_date timestamp with time zone,
    profile_metadata jsonb DEFAULT '{}'::jsonb,
    id integer NOT NULL DEFAULT nextval('users_new_id_seq'::regclass),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role::text = ANY (ARRAY['user'::character varying, 'admin'::character varying, 'co_admin'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;