--
-- PostgreSQL database dump
--

\restrict uotQnqiFqMQxFcmQ8FpOHuapJWUFdsh9LcQDe7IonjJS2hXyJbBbekaCdw5OusA

-- Dumped from database version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: integer-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "integer-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "integer-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "integer-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


--
-- Name: advise_content_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.advise_content_library_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_resources (
    id integer NOT NULL,
    type character varying(50) NOT NULL,
    title character varying(255),
    description text,
    icon_name character varying(100),
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: assessment_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_questions (
    id integer NOT NULL,
    category character varying(50) NOT NULL,
    question_text text NOT NULL,
    question_type character varying(50) DEFAULT 'text'::character varying,
    options jsonb DEFAULT '[]'::jsonb,
    display_order integer DEFAULT 0,
    is_required boolean DEFAULT true,
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: assessment_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assessment_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assessment_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessment_questions_id_seq OWNED BY public.assessment_questions.id;


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id SERIAL NOT NULL,
    community_id integer,
    user_id integer,
    content text NOT NULL,
    message_type character varying(20) DEFAULT 'text'::character varying,
    file_url character varying(500),
    reply_to integer,
    is_edited boolean DEFAULT false,
    edited_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chat_messages_message_type_check CHECK (((message_type)::text = ANY ((ARRAY['text'::character varying, 'image'::character varying, 'file'::character varying, 'system'::character varying])::text[])))
);


--
-- Name: communities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communities (
    id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    avatar_url character varying(500),
    created_by integer,
    is_private boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: community_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.community_members (
    id SERIAL NOT NULL,
    community_id integer,
    user_id integer,
    role character varying(20) DEFAULT 'member'::character varying,
    joined_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_muted boolean DEFAULT false,
    CONSTRAINT community_members_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'moderator'::character varying, 'member'::character varying])::text[])))
);


--
-- Name: community_online_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.community_online_users (
    id SERIAL NOT NULL,
    community_id integer,
    user_id integer,
    socket_id character varying(255) NOT NULL,
    last_seen timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: content_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.content_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: content_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.content_items_id_seq OWNED BY public.app_resources.id;


--
-- Name: contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contents (
    id SERIAL NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    description text,
    content text NOT NULL,
    status character varying(50) DEFAULT 'Draft'::character varying NOT NULL,
    publish_date date,
    end_date date,
    media_url text,
    tags text[],
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT contents_category_check CHECK (((category)::text = ANY ((ARRAY['Blog'::character varying, 'Quote'::character varying, 'Campaign'::character varying, 'Video'::character varying, 'Podcast'::character varying, 'Image'::character varying])::text[]))),
    CONSTRAINT contents_status_check CHECK (((status)::text = ANY ((ARRAY['Draft'::character varying, 'Pending'::character varying, 'Live'::character varying])::text[])))
);


--
-- Name: coping_strategies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coping_strategies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: daily_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_logs (
    id SERIAL NOT NULL,
    user_id integer NOT NULL,
    log_date date NOT NULL,
    smoked boolean NOT NULL,
    cigarettes_count integer,
    cravings_level integer,
    mood integer,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT daily_logs_cigarettes_count_check CHECK ((cigarettes_count >= 0)),
    CONSTRAINT daily_logs_cravings_level_check CHECK (((cravings_level >= 1) AND (cravings_level <= 10))),
    CONSTRAINT daily_logs_mood_check CHECK (((mood >= 1) AND (mood <= 10)))
);


--
-- Name: fagerstrom_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--



--
-- Name: ; Type: TABLE; Schema: public; Owner: -
--



--
-- Name: fivea_assist_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fivea_assist_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fivea_assist_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fivea_assist_plans (
    id integer NOT NULL,
    user_id integer NOT NULL,
    quit_date date,
    triggers text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: fivea_assist_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fivea_assist_plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fivea_assist_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fivea_assist_plans_id_seq OWNED BY public.fivea_assist_plans.id;


--
-- Name: fivea_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fivea_history (
    id SERIAL NOT NULL,
    user_id integer NOT NULL,
    stage character varying(50) NOT NULL,
    history_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: fivea_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fivea_questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fivea_user_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fivea_user_answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_reactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_reactions (
    id SERIAL NOT NULL,
    message_id integer,
    user_id integer,
    emoji character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: notification_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_templates (
    id integer NOT NULL,
    key text NOT NULL,
    title text,
    default_time time without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: notification_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.notification_templates ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notification_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: quit_tracker_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quit_tracker_settings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    goal_days integer DEFAULT 30,
    daily_reminder_time time without time zone DEFAULT '09:00:00'::time without time zone,
    is_tracking_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: quit_tracker_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quit_tracker_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quit_tracker_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quit_tracker_settings_id_seq OWNED BY public.quit_tracker_settings.id;


--
-- Name: user_5r_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_5r_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    current_step character varying(20) DEFAULT 'relevance'::character varying NOT NULL,
    is_completed boolean DEFAULT false,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_5r_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_5r_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_5r_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_5r_progress_id_seq OWNED BY public.user_5r_progress.id;


--
-- Name: user_assessment_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_assessment_responses (
    id SERIAL NOT NULL,
    user_id integer NOT NULL,
    question_id integer NOT NULL,
    response_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    assessment_context character varying(50) DEFAULT 'default'::character varying
);


--
-- Name: user_chat_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_chat_logs (
    id SERIAL NOT NULL,
    user_id integer NOT NULL,
    chat_date date NOT NULL,
    messages jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE user_chat_logs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_chat_logs IS 'Stores daily chat messages for users in JSONB format for efficient storage and retrieval';


--
-- Name: COLUMN user_chat_logs.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_chat_logs.user_id IS 'integer of the user who owns the chat messages';


--
-- Name: COLUMN user_chat_logs.chat_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_chat_logs.chat_date IS 'Date of the chat messages (one row per user per day)';


--
-- Name: COLUMN user_chat_logs.messages; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_chat_logs.messages IS 'Example: [{"role": "user", "content": "hello"}, {"role": "assistant", "content": "hi there"}]';


--
-- Name: user_coping_strategies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_coping_strategies (
    id integer NOT NULL,
    user_id integer NOT NULL,
    strategy_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: user_coping_strategies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_coping_strategies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_coping_strategies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_coping_strategies_id_seq OWNED BY public.user_coping_strategies.id;


--
-- Name: user_learning_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_learning_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    content_ids jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_learning_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_learning_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_learning_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_learning_progress_id_seq OWNED BY public.user_learning_progress.id;


--
-- Name: user_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    template_id integer NOT NULL,
    enabled boolean DEFAULT true,
    "time" time without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: user_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_notifications_id_seq OWNED BY public.user_notifications.id;


--
-- Name: user_relevance_selections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_relevance_selections (
    id integer NOT NULL,
    user_id integer NOT NULL,
    relevance_option_id integer NOT NULL,
    selected_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_relevance_selections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_relevance_selections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_relevance_selections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_relevance_selections_id_seq OWNED BY public.user_relevance_selections.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id SERIAL NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    onboarding_step integer DEFAULT 0,
    onboarding_completed boolean DEFAULT false,
    full_name character varying(255),
    first_name character varying(100),
    last_name character varying(100),
    phone character varying(50),
    age integer,
    gender character varying(50),
    bio text,
    avatar_url text,
    tobacco_type character varying(50),
    addiction_level character varying(50),
    fagerstrom_score integer,
    quit_date date,
    join_date timestamp with time zone,
    last_login timestamp with time zone,
    profile_metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying, 'co_admin'::character varying])::text[]))),
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying])::text[])))
);


--
-- Name: app_resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_resources ALTER COLUMN id SET DEFAULT nextval('public.content_items_id_seq'::regclass);


--
-- Name: assessment_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_questions ALTER COLUMN id SET DEFAULT nextval('public.assessment_questions_id_seq'::regclass);


--
-- Name: fivea_assist_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fivea_assist_plans ALTER COLUMN id SET DEFAULT nextval('public.fivea_assist_plans_id_seq'::regclass);


--
-- Name: quit_tracker_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quit_tracker_settings ALTER COLUMN id SET DEFAULT nextval('public.quit_tracker_settings_id_seq'::regclass);


--
-- Name: user_5r_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_5r_progress ALTER COLUMN id SET DEFAULT nextval('public.user_5r_progress_id_seq'::regclass);


--
-- Name: user_coping_strategies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_coping_strategies ALTER COLUMN id SET DEFAULT nextval('public.user_coping_strategies_id_seq'::regclass);


--
-- Name: user_learning_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_learning_progress ALTER COLUMN id SET DEFAULT nextval('public.user_learning_progress_id_seq'::regclass);


--
-- Name: user_notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notifications ALTER COLUMN id SET DEFAULT nextval('public.user_notifications_id_seq'::regclass);


--
-- Name: user_relevance_selections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_relevance_selections ALTER COLUMN id SET DEFAULT nextval('public.user_relevance_selections_id_seq'::regclass);


--
-- Name: assessment_questions assessment_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_questions
    ADD CONSTRAINT assessment_questions_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: communities communities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_pkey PRIMARY KEY (id);


--
-- Name: community_members community_members_community_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_members
    ADD CONSTRAINT community_members_community_id_user_id_key UNIQUE (community_id, user_id);


--
-- Name: community_members community_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_members
    ADD CONSTRAINT community_members_pkey PRIMARY KEY (id);


--
-- Name: community_online_users community_online_users_community_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_online_users
    ADD CONSTRAINT community_online_users_community_id_user_id_key UNIQUE (community_id, user_id);


--
-- Name: community_online_users community_online_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_online_users
    ADD CONSTRAINT community_online_users_pkey PRIMARY KEY (id);


--
-- Name: app_resources content_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_resources
    ADD CONSTRAINT content_items_pkey PRIMARY KEY (id);


--
-- Name: contents contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (id);


--
-- Name: daily_logs daily_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_logs
    ADD CONSTRAINT daily_logs_pkey PRIMARY KEY (id);


--
-- Name:  _pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.
    ADD CONSTRAINT _pkey PRIMARY KEY (id);


--
-- Name: fivea_assist_plans fivea_assist_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fivea_assist_plans
    ADD CONSTRAINT fivea_assist_plans_pkey PRIMARY KEY (id);


--
-- Name: fivea_history fivea_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fivea_history
    ADD CONSTRAINT fivea_history_pkey PRIMARY KEY (id);


--
-- Name: message_reactions message_reactions_message_id_user_id_emoji_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_reactions
    ADD CONSTRAINT message_reactions_message_id_user_id_emoji_key UNIQUE (message_id, user_id, emoji);


--
-- Name: message_reactions message_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_reactions
    ADD CONSTRAINT message_reactions_pkey PRIMARY KEY (id);


--
-- Name: notification_templates notification_templates_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_key_key UNIQUE (key);


--
-- Name: notification_templates notification_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_pkey PRIMARY KEY (id);


--
-- Name: quit_tracker_settings quit_tracker_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quit_tracker_settings
    ADD CONSTRAINT quit_tracker_settings_pkey PRIMARY KEY (id);


--
-- Name: quit_tracker_settings quit_tracker_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quit_tracker_settings
    ADD CONSTRAINT quit_tracker_settings_user_id_key UNIQUE (user_id);


--
-- Name: user_5r_progress user_5r_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_5r_progress
    ADD CONSTRAINT user_5r_progress_pkey PRIMARY KEY (id);


--
-- Name: user_5r_progress user_5r_progress_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_5r_progress
    ADD CONSTRAINT user_5r_progress_user_id_key UNIQUE (user_id);


--
-- Name: user_assessment_responses user_assessment_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_assessment_responses
    ADD CONSTRAINT user_assessment_responses_pkey PRIMARY KEY (id);


--
-- Name: user_assessment_responses user_assessment_responses_unique_context; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_assessment_responses
    ADD CONSTRAINT user_assessment_responses_unique_context UNIQUE (user_id, question_id, assessment_context);


--
-- Name: user_chat_logs user_chat_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_chat_logs
    ADD CONSTRAINT user_chat_logs_pkey PRIMARY KEY (id);


--
-- Name: user_chat_logs user_chat_logs_user_id_chat_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_chat_logs
    ADD CONSTRAINT user_chat_logs_user_id_chat_date_key UNIQUE (user_id, chat_date);


--
-- Name: user_coping_strategies user_coping_strategies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_coping_strategies
    ADD CONSTRAINT user_coping_strategies_pkey PRIMARY KEY (id);


--
-- Name: user_learning_progress user_learning_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_learning_progress
    ADD CONSTRAINT user_learning_progress_pkey PRIMARY KEY (id);


--
-- Name: user_learning_progress user_learning_progress_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_learning_progress
    ADD CONSTRAINT user_learning_progress_user_id_key UNIQUE (user_id);


--
-- Name: user_notifications user_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_pkey PRIMARY KEY (id);


--
-- Name: user_notifications user_notifications_user_id_template_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_user_id_template_id_key UNIQUE (user_id, template_id);


--
-- Name: user_relevance_selections user_relevance_selections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_relevance_selections
    ADD CONSTRAINT user_relevance_selections_pkey PRIMARY KEY (id);


--
-- Name: user_relevance_selections user_relevance_selections_user_id_relevance_option_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_relevance_selections
    ADD CONSTRAINT user_relevance_selections_user_id_relevance_option_id_key UNIQUE (user_id, relevance_option_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_app_resources_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_app_resources_type ON public.app_resources USING btree (type);


--
-- Name: idx_assessment_questions_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assessment_questions_category ON public.assessment_questions USING btree (category);


--
-- Name: idx_chat_messages_community_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_community_id ON public.chat_messages USING btree (community_id);


--
-- Name: idx_chat_messages_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_created_at ON public.chat_messages USING btree (created_at);


--
-- Name: idx_chat_messages_reply_to; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_reply_to ON public.chat_messages USING btree (reply_to);


--
-- Name: idx_chat_messages_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_user_id ON public.chat_messages USING btree (user_id);


--
-- Name: idx_communities_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_communities_created_at ON public.communities USING btree (created_at);


--
-- Name: idx_communities_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_communities_created_by ON public.communities USING btree (created_by);


--
-- Name: idx_community_members_community_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_community_members_community_id ON public.community_members USING btree (community_id);


--
-- Name: idx_community_members_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_community_members_user_id ON public.community_members USING btree (user_id);


--
-- Name: idx_community_online_users_community_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_community_online_users_community_id ON public.community_online_users USING btree (community_id);


--
-- Name: idx_community_online_users_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_community_online_users_user_id ON public.community_online_users USING btree (user_id);


--
-- Name: idx_contents_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contents_category ON public.contents USING btree (category);


--
-- Name: idx_contents_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contents_created_at ON public.contents USING btree (created_at);


--
-- Name: idx_contents_publish_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contents_publish_date ON public.contents USING btree (publish_date);


--
-- Name: idx_contents_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contents_status ON public.contents USING btree (status);


--
-- Name: idx_contents_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contents_title ON public.contents USING gin (to_tsvector('english'::regconfig, (title)::text));


--
-- Name: idx_daily_logs_date_range; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_daily_logs_date_range ON public.daily_logs USING btree (user_id, log_date DESC);


--
-- Name: idx_daily_logs_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_daily_logs_user_created ON public.daily_logs USING btree (user_id, created_at DESC);


--
-- Name: idx_daily_logs_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_daily_logs_user_date ON public.daily_logs USING btree (user_id, log_date);


--
-- Name: idx__created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx__created_at ON public. USING btree (created_at DESC);


--
-- Name: idx__user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx__user_id ON public. USING btree (user_id);


--
-- Name: idx_fivea_history_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fivea_history_stage ON public.fivea_history USING btree (stage);


--
-- Name: idx_fivea_history_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fivea_history_user ON public.fivea_history USING btree (user_id);


--
-- Name: idx_message_reactions_message_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_reactions_message_id ON public.message_reactions USING btree (message_id);


--
-- Name: idx_user_5r_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_5r_progress_user_id ON public.user_5r_progress USING btree (user_id);


--
-- Name: idx_user_chat_logs_chat_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_chat_logs_chat_date ON public.user_chat_logs USING btree (chat_date);


--
-- Name: idx_user_chat_logs_messages_gin; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_chat_logs_messages_gin ON public.user_chat_logs USING gin (messages);


--
-- Name: idx_user_chat_logs_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_chat_logs_user_date ON public.user_chat_logs USING btree (user_id, chat_date);


--
-- Name: idx_user_chat_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_chat_logs_user_id ON public.user_chat_logs USING btree (user_id);


--
-- Name: idx_user_learning_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_learning_progress_user_id ON public.user_learning_progress USING btree (user_id);


--
-- Name: idx_user_logdate; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_user_logdate ON public.daily_logs USING btree (user_id, log_date);


--
-- Name: idx_user_relevance_selections_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_relevance_selections_user_id ON public.user_relevance_selections USING btree (user_id);


--
-- Name: idx_user_responses_question; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_responses_question ON public.user_assessment_responses USING btree (question_id);


--
-- Name: idx_user_responses_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_responses_user ON public.user_assessment_responses USING btree (user_id);


--
-- Name: communities update_communities_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON public.communities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: contents update_contents_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON public.contents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: daily_logs update_daily_logs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON public.daily_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name:  update__updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update__updated_at BEFORE UPDATE ON public. FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_5r_progress update_user_5r_progress_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_5r_progress_updated_at BEFORE UPDATE ON public.user_5r_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_chat_logs update_user_chat_logs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_chat_logs_updated_at BEFORE UPDATE ON public.user_chat_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_learning_progress update_user_learning_progress_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_learning_progress_updated_at BEFORE UPDATE ON public.user_learning_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: chat_messages chat_messages_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_reply_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_reply_to_fkey FOREIGN KEY (reply_to) REFERENCES public.chat_messages(id) ON DELETE SET NULL;


--
-- Name: chat_messages chat_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: communities communities_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: community_members community_members_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_members
    ADD CONSTRAINT community_members_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE;


--
-- Name: community_members community_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_members
    ADD CONSTRAINT community_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: community_online_users community_online_users_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_online_users
    ADD CONSTRAINT community_online_users_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE;


--
-- Name: community_online_users community_online_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_online_users
    ADD CONSTRAINT community_online_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: daily_logs daily_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_logs
    ADD CONSTRAINT daily_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name:  _user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.
    ADD CONSTRAINT _user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fivea_history fivea_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fivea_history
    ADD CONSTRAINT fivea_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: message_reactions message_reactions_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_reactions
    ADD CONSTRAINT message_reactions_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.chat_messages(id) ON DELETE CASCADE;


--
-- Name: message_reactions message_reactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_reactions
    ADD CONSTRAINT message_reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: quit_tracker_settings quit_tracker_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quit_tracker_settings
    ADD CONSTRAINT quit_tracker_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_5r_progress user_5r_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_5r_progress
    ADD CONSTRAINT user_5r_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_assessment_responses user_assessment_responses_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_assessment_responses
    ADD CONSTRAINT user_assessment_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.assessment_questions(id) ON DELETE CASCADE;


--
-- Name: user_assessment_responses user_assessment_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_assessment_responses
    ADD CONSTRAINT user_assessment_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_coping_strategies user_coping_strategies_strategy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_coping_strategies
    ADD CONSTRAINT user_coping_strategies_strategy_id_fkey FOREIGN KEY (strategy_id) REFERENCES public.app_resources(id) ON DELETE CASCADE;


--
-- Name: user_learning_progress user_learning_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_learning_progress
    ADD CONSTRAINT user_learning_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_notifications user_notifications_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.notification_templates(id) ON DELETE CASCADE;


--
-- Name: user_relevance_selections user_relevance_selections_relevance_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_relevance_selections
    ADD CONSTRAINT user_relevance_selections_relevance_option_id_fkey FOREIGN KEY (relevance_option_id) REFERENCES public.app_resources(id) ON DELETE CASCADE;


--
-- Name: user_relevance_selections user_relevance_selections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_relevance_selections
    ADD CONSTRAINT user_relevance_selections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict uotQnqiFqMQxFcmQ8FpOHuapJWUFdsh9LcQDe7IonjJS2hXyJbBbekaCdw5OusA

--
-- PostgreSQL database dump
--

\restrict c6hjm0ILLIb0PP0bBaj0v3GkSr7KSvEiGCcH8OUHGzxjpUfWzCcxaOog41XUbxu

-- Dumped from database version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: app_resources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.app_resources (id, type, title, description, icon_name, display_order, is_active, metadata, created_at, updated_at) FROM stdin;
1	coping_strategy	Deep breathing exercises	Short breathing exercises to manage cravings	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
2	coping_strategy	Chewing gum or mints	Sugar-free gum or mints as oral substitute	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
3	coping_strategy	Call a friend or family member	Contact a trusted person during cravings	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
4	coping_strategy	Physical activity	Walk, jog, or exercise to distract	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
5	coping_strategy	Drink water	Hydrate to reduce cravings	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
6	coping_strategy	Nicotine replacement therapy	Patch, gum, lozenges as advised by clinicians	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
7	coping_strategy	Mindfulness/meditation	Short mindfulness exercises	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
8	coping_strategy	Keep hands busy	Stress ball or fidget to occupy hands	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
9	coping_strategy	Avoid triggers	Avoid coffee, alcohol, or situations that trigger use	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
10	coping_strategy	Positive self-talk	Use affirmations and reminders of goals	\N	0	t	{"user_id": null}	2025-11-26 15:38:25.177765+05:30	2025-12-12 14:20:13.700493+05:30
11	relevance_option	Health	Improve physical and oral health	heart	0	t	{"option_key": "health"}	2025-12-12 14:20:13.706309+05:30	2025-12-12 14:20:13.706309+05:30
12	relevance_option	Family	Be there for loved ones	users	0	t	{"option_key": "family"}	2025-12-12 14:20:13.706309+05:30	2025-12-12 14:20:13.706309+05:30
13	relevance_option	Money	Save significant expenses	dollar-sign	0	t	{"option_key": "money"}	2025-12-12 14:20:13.706309+05:30	2025-12-12 14:20:13.706309+05:30
14	relevance_option	Appearance	Better teeth, skin, and overall look	sparkles	0	t	{"option_key": "appearance"}	2025-12-12 14:20:13.706309+05:30	2025-12-12 14:20:13.706309+05:30
15	relevance_option	Social Image	Improve social perception	user-circle	0	t	{"option_key": "social"}	2025-12-12 14:20:13.706309+05:30	2025-12-12 14:20:13.706309+05:30
16	advice	low	Your body starts healing after 20 minutes...	\N	0	t	{"video_url": "video_low.mp4", "severity_level": "low", "ai_message_template": "As a {{age}} year old reducing risk by 60%..."}	2025-12-12 14:20:13.708566+05:30	2025-12-12 14:20:13.708566+05:30
17	advice	medium	Quitting now improves lung capacity...	\N	0	t	{"video_url": "video_medium.mp4", "severity_level": "medium", "ai_message_template": "You can add 8–10 years if you quit now..."}	2025-12-12 14:20:13.708566+05:30	2025-12-12 14:20:13.708566+05:30
18	advice	high	Every cigarette increases cancer risk...	\N	0	t	{"video_url": "video_high.mp4", "severity_level": "high", "ai_message_template": "You reduce risk of mouth cancer by 90% after quitting..."}	2025-12-12 14:20:13.708566+05:30	2025-12-12 14:20:13.708566+05:30
19	advice	low	Your body starts healing after 20 minutes...	\N	0	t	{"video_url": "video_low.mp4", "severity_level": "low", "ai_message_template": "As a {{age}} year old reducing risk by 60%..."}	2025-12-12 14:20:13.708566+05:30	2025-12-12 14:20:13.708566+05:30
20	advice	medium	Quitting now improves lung capacity...	\N	0	t	{"video_url": "video_medium.mp4", "severity_level": "medium", "ai_message_template": "You can add 8–10 years if you quit now..."}	2025-12-12 14:20:13.708566+05:30	2025-12-12 14:20:13.708566+05:30
21	advice	high	Every cigarette increases cancer risk...	\N	0	t	{"video_url": "video_high.mp4", "severity_level": "high", "ai_message_template": "You reduce risk of mouth cancer by 90% after quitting..."}	2025-12-12 14:20:13.708566+05:30	2025-12-12 14:20:13.708566+05:30
\.


--
-- Data for Name: assessment_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assessment_questions (id, category, question_text, question_type, options, display_order, is_required, is_active, metadata, created_at, updated_at) FROM stdin;
1	fagerstrom	Do you currently smoke cigarettes?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
2	fagerstrom	How soon after you wake up do you smoke your first cigarette?	text	["Within 5 minutes", "6-30 minutes", "31-60 minutes", "After 60 minutes"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
3	fagerstrom	Do you find it difficult to refrain from smoking in forbidden places?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
4	fagerstrom	Which cigarette would you hate to give up the most?	text	["The first one in the morning", "Any other"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
5	fagerstrom	How many cigarettes per day do you smoke?	text	["10 or less", "11-20", "21-30", "31 or more"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
6	fagerstrom	Do you smoke more during the first hours after waking?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
7	fagerstrom	Do you smoke while sick and in bed?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
8	fagerstrom	Do you currently smoke cigarettes?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
9	fagerstrom	How soon after you wake up do you smoke your first cigarette?	text	["Within 5 minutes", "6-30 minutes", "31-60 minutes", "After 60 minutes"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
10	fagerstrom	Do you find it difficult to refrain from smoking in forbidden places?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
11	fagerstrom	Which cigarette would you hate to give up the most?	text	["The first one in the morning", "Any other"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
12	fagerstrom	How many cigarettes per day do you smoke?	text	["10 or less", "11-20", "21-30", "31 or more"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
13	fagerstrom	Do you smoke more during the first hours after waking?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
14	fagerstrom	Do you smoke while sick and in bed?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smoked"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
15	fagerstrom	How soon after you wake up do you place your first dip?	text	["Within 5 minutes", "6–30 minutes", "31–60 minutes", "After 60 minutes"]	0	t	t	{"tobacco_category": "smokeless"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
16	fagerstrom	How often do you intentionally swallow tobacco juice?	text	["Always", "Sometimes", "Never"]	0	t	t	{"tobacco_category": "smokeless"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
17	fagerstrom	Which chew would you hate to give up most?	text	["The first one in the morning", "The one after meals", "The one when you are stressed", "Other"]	0	t	t	{"tobacco_category": "smokeless"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
18	fagerstrom	How many cans/pouches per week do you use?	text	["1", "2–3", "4–6", "More than 7"]	0	t	t	{"tobacco_category": "smokeless"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
19	fagerstrom	Do you chew more frequently during the first hours after awakening than during the rest of the day?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smokeless"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
20	fagerstrom	Do you chew if you are so ill that you are in bed most of the day?	text	["Yes", "No"]	0	t	t	{"tobacco_category": "smokeless"}	2025-12-12 14:20:13.709937+05:30	2025-12-12 14:20:13.709937+05:30
21	fivea	What type of tobacco do you use?	text	["Cigarettes", "Beedi", "Cigars", "Chewing Tobacco", "Hookah", "Other"]	0	t	t	{"step": "ask", "tobacco_category": "smoked"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
22	fivea	How often do you use tobacco in a day?	text	["1-2 times", "3-5 times", "6-10 times", "More than 10 times"]	0	t	t	{"step": "ask", "tobacco_category": "smoked"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
23	fivea	What type of tobacco do you use?	text	["Cigarettes", "Beedi", "Cigars", "Others"]	0	t	t	{"step": "ask", "tobacco_category": "smoked"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
24	fivea	How often do you use tobacco in a day?	text	["1-2 times", "3-5 times", "6-10 times", "More than 10 times"]	0	t	t	{"step": "ask", "tobacco_category": "smoked"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
25	fivea	For how long have you been using tobacco?	text	["Less than 6 months", "6 months - 1 year", "1-5 years", "More than 5 years"]	0	t	t	{"step": "ask", "tobacco_category": "smoked"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
26	fivea	How much tobacco do you consume in a day?	text	["Less than 5 cigarettes/beedis", "5-10 cigarettes/beedis", "11-20 cigarettes/beedis", "More than 20 cigarettes/beedis"]	0	t	t	{"step": "ask", "tobacco_category": "smoked"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
27	fivea	How much money do you spend on each cigarette or tobacco use?	text	["Less than ₹5", "₹5-₹10", "₹11-₹20", "More than ₹20", "Others"]	0	t	t	{"step": "ask", "tobacco_category": "smoked"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
28	fivea	When do you plan to quit?	text	["Within next month", "Within next 2 months", "Not sure yet"]	0	t	t	{"step": "assess", "tobacco_category": "smoked"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
29	fivea	How ready are you to quit tobacco?	text	[]	0	t	t	{"step": "assess", "tobacco_category": "smoked"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
30	fivea	What type of smokeless tobacco you use ?	text	["Pan", "Ghutka", "Tambako", "Others"]	0	t	t	{"step": "ask", "tobacco_category": "smokeless"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
31	fivea	How often do you use tobacco in a day?	text	["1-2 times", "3-5 times", "6-10 times", "More than 10 times"]	0	t	t	{"step": "ask", "tobacco_category": "smokeless"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
32	fivea	For how long have you been using tobacco?	text	["Less than 6 months", "6 months - 1 year", "1-5 years", "More than 5 years"]	0	t	t	{"step": "ask", "tobacco_category": "smokeless"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
33	fivea	How much money do you spend on each tobacco use?	text	["₹5-₹10", "₹11-₹20", "More than ₹20", "Others"]	0	t	t	{"step": "ask", "tobacco_category": "smokeless"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
34	fivea	How much tobacco do you consume in a day?	text	["Less than 5 units", "5 - 10 units", "11-20 units", "More than 20 units"]	0	t	t	{"step": "ask", "tobacco_category": "smokeless"}	2025-12-12 14:20:13.711419+05:30	2025-12-12 14:20:13.711419+05:30
35	quit_tracker	Do you have the urge to smoke?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	1	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
36	quit_tracker	Do you smoke seeing someone else smoking?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	2	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
37	quit_tracker	Do you smoke when you feel stressed?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	3	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
38	quit_tracker	Do you smoke when you get angry?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	4	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
39	quit_tracker	Do you smoke when you need to concentrate?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	5	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
40	quit_tracker	Do you smoke when you think about difficult problems?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	6	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
41	quit_tracker	Do you smoke when you are with smokers?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	7	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
42	quit_tracker	Do you smoke when your friends/family wants you to smoke?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	8	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
43	quit_tracker	Do you smoke after meal?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	9	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
44	quit_tracker	Do you smoke when you are bored/waiting?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	10	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
45	quit_tracker	Do you smoke when you are offered with cigarettes?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	11	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
46	quit_tracker	Do you smoke when you have extra pocket money?	multiple_choice	["Not at all sure", "Not very sure", "More or less sure", "Fairly sure", "Absolutely sure"]	12	t	t	{}	2025-12-12 14:20:13.713074+05:30	2025-12-12 14:20:13.713074+05:30
47	quit_tracker_feedback	Did you find the yen quit app useful?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	1	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
48	quit_tracker_feedback	Was it easy for you to use the yen quit app?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	2	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
49	quit_tracker_feedback	Did the yen quit app meet the needs?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	3	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
50	quit_tracker_feedback	Do you find yen quit app user friendly ?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	4	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
51	quit_tracker_feedback	Did the yen quit app adequately acknowledged and provided information?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	5	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
52	quit_tracker_feedback	Do you think yen quit app would be supportive tool for tobacco cessation?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	6	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
53	quit_tracker_feedback	Do you think yen quit app will be effective for young adults?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	7	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
54	quit_tracker_feedback	Would you recommend yen quit app to your friend?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	8	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
55	quit_tracker_feedback	Did yen quit app help you in quitting tobacco?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	9	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
56	quit_tracker_feedback	Smoking abstinence was there after using yen quit app?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	10	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
57	quit_tracker_feedback	Will you be using this app as a personal tool for tobacco cessation?	text	["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]	11	t	t	{}	2025-12-12 14:20:13.714509+05:30	2025-12-12 14:20:13.714509+05:30
\.


--
-- Data for Name: contents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contents (id, title, category, description, content, status, publish_date, end_date, media_url, tags, created_at, updated_at) FROM stdin;
1a0e9a5a-527e-4d57-8999-94fc42e8514b	How to Quit Smoking, Vaping or Dipping Tobacco	Video	\N		Live	\N	\N	https://youtu.be/QpnGsasp9j8	{}	2025-12-04 11:33:21.13561	2025-12-04 11:33:21.13561
d31e45dc-3675-4774-92e7-19412d19c9a9	Smoking Cessation | Helping Patients Quit Smoking	Video	\N		Live	\N	\N	https://youtu.be/Rdk9mpedwNk	{}	2025-12-04 11:24:36.022949	2025-12-04 11:24:36.022949
bbbd8c77-6612-4c50-a3c6-b3f9c8c6b5de	How I quit smoking: David’s story | Ohio State Medical Center	Video	\N		Live	\N	\N	https://youtu.be/vKS-dIj81rk	{}	2025-12-04 11:27:09.218558	2025-12-04 11:27:09.218558
9f6774c1-fb64-45a0-8b36-2edd3bb1d366	Smoking Cessation Counseling for Medical Students	Video	\N		Live	\N	\N	https://youtu.be/5IaPt_RgzIE	{}	2025-12-04 11:28:37.12517	2025-12-04 11:29:09.160226
ff27845b-6b82-49eb-8d7d-6d5fd4f7e9df	How do cigarettes affect the body? - Krishna Sudhir	Video	\N		Live	\N	\N	https://youtu.be/Y18Vz51Nkos	{}	2025-12-04 11:32:32.000322	2025-12-04 11:32:32.000322
340f4182-5fe0-4865-ba75-d9d324526e91	Sacred Tobacco, a documentary by Luis Solarat	Podcast	\N		Live	\N	\N	https://youtu.be/KB0JEQALI_w	{}	2025-12-04 11:35:28.223247	2025-12-04 11:35:28.223247
20e2f11b-2961-4dd1-ada7-1fb4bb137412	We Have To Talk About Weed	Podcast	\N		Live	\N	\N	https://youtu.be/qBRaI0ZeAf8	{}	2025-12-04 11:36:28.607901	2025-12-04 11:36:28.607901
0f213411-c1e3-42da-bb20-ba6d42a8fbf6	ow To Reprogram Your Dopamine To Crave Hard Work	Podcast	\N		Live	\N	\N	https://youtu.be/8GUNhGRlQDU	{}	2025-12-04 11:36:51.07887	2025-12-04 11:36:51.07887
969c6be8-3ecc-4a72-af75-ce906dc88ff2	How To Enter Flow State In 11 Minutes (Step by Step)	Podcast	\N		Live	\N	\N	https://youtu.be/bzW-zV4JhK4	{}	2025-12-04 11:37:15.102986	2025-12-04 11:37:15.102986
d805c851-3ce0-40f7-a6d4-2292182becb2	Quotes to Help You Quit Smoking	Image	\N		Live	\N	\N	https://imgs.search.brave.com/44dBjrr5u8NQbxYf5w5XOkdHapTdzDMa6OVU3Ngy9IQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ncmFj/aW91c3F1b3Rlcy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDcvUXVvdGVz/LXRvLUhlbHAtWW91/LVF1aXQtU21va2lu/Zy1JTlNQSVJBVElP/Ti1HcmFjaW91cy1R/dW90ZXMuanBlZw	{"Gracious Quotes"}	2025-12-04 11:38:09.85215	2025-12-04 11:38:09.85215
e83ac9eb-26eb-42c5-8727-570bb6a03277	￼ ￼ ￼ Quit Smoking Motivation Quotes	Image	\N		Live	\N	\N	https://imgs.search.brave.com/agyKLg2fU-qSObNNKuHlSp2Qvnz9RBsMs3GdzLe5ev4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlcmFuZG9tdmli/ZXouY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIyLzA1L1F1/aXQtU21va2luZy1N/b3RpdmF0aW9uLVF1/b3Rlcy00MDB4NTQ1/LmpwZw	{"Motivation Quotes"}	2025-12-04 11:39:48.662301	2025-12-04 11:39:48.662301
28c94d66-e538-4a6b-b96e-14fd59cbc6d7	Your craving	Image	\N		Live	\N	\N	https://imgs.search.brave.com/GnOWJCxA91h4tiy6lXnEVqLPHb_JTrOC1BtQ_nziv3g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2JhLzdh/LzgyL2JhN2E4MjYz/Zjk1YjMzNjI5ZjIy/YjAzZDZmOTBiNGE3/LmpwZw	{"Your craving"}	2025-12-04 11:40:34.491398	2025-12-04 11:40:34.491398
662e3317-b002-4e28-8ad2-af35693db198	Quitting smoking	Image	\N		Live	\N	\N	https://imgs.search.brave.com/XimOw7U8ctZk-5qeF5JxKWhFNnJVAd8wci6heIn-asc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ncmFj/aW91c3F1b3Rlcy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDcvUXVpdHRp/bmctc21va2luZy1p/cy1saWtlLWdpdmlu/Zy15b3Vyc2VsZi1h/LXNlY29uZC1jaGFu/Y2UtYXQtbGlmZS4t/RW1icmFjZS1pdC5q/cGc	{"Quitting smoking"}	2025-12-04 11:40:54.580385	2025-12-04 11:40:54.580385
068f827c-1f77-4a98-a7bb-24a073fc3795	STOP SMOKING TODAY:	Image	\N		Live	\N	\N	https://imgs.search.brave.com/GJG-mJZ9QChpxehhPurye4ngONaDterE2OMESkFTgVQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFqaUhyeHItTUwu/anBn	{"STOP SMOKING"}	2025-12-04 11:41:20.440155	2025-12-04 11:41:20.440155
e3e76d0b-195e-456b-8caf-35d115fcbdbb	Why Quitting Smoking Today Is Easier Than Ever: A Science-Backed Guide	Blog	\N	Smoking cessation has evolved tremendously over the past decade. What used to feel like a battle of willpower is now supported by research-driven strategies, psychological insights, and smarter digital tools. Evidence shows that you’re 4x more likely to quit successfully when you combine behavioral support with nicotine replacement or medication.\r\n\r\nModern tools include:\r\n\r\nNicotine patches, gums, and inhalers\r\n\r\nPrescription meds like Varenicline\r\n\r\nDigital quit apps with reminders, craving trackers, and habit-rewiring features\r\n\r\nOnline therapy and community support groups\r\n\r\nQuitting is no longer about resisting cravings. It’s about understanding triggers, replacing routines, and building confidence step by step. With science in your corner, you’re not quitting alone—you’re upgrading your lifestyle	Live	\N	\N	\N	{"Informative Blog"}	2025-12-04 11:46:33.737055	2025-12-04 11:46:33.737055
9a515c9d-d0a9-4a43-8ec3-a09ad765c28a	The Day I Realized Smoking Wasn’t Relaxing Me—It Was Controlling Me	Blog	\N	For years, I believed cigarettes were my comfort. My shield. My five-minute escape from stress.\r\nBut one morning, sitting alone with a coffee and a cough that felt older than me, I realized something painful:\r\n\r\nI didn’t choose smoking—smoking chose me.\r\n\r\nThat day became my turning point. Quitting wasn’t easy, but every craving was a reminder that I was taking my power back. Every hour smoke-free felt like a victory. Every morning I woke up breathing easier, I felt reborn.\r\n\r\nIf you're reading this, maybe you’re at your turning point too.\r\n\r\nRemember:\r\nYou don’t have to quit perfectly.\r\nYou only have to keep choosing yourself.	Live	\N	\N	\N	{"Inspirational Blog"}	2025-12-04 11:46:55.552862	2025-12-04 11:46:55.552862
c95ad1e9-940b-4adf-b88a-c78a8971a3f8	How Smoking Affects Your Body in the First 30 Days After You Quit”	Blog	\N	Health recovery begins immediately after quitting smoking:\r\n\r\n20 minutes: Heart rate and blood pressure begin to normalize.\r\n\r\n8 hours: Carbon monoxide levels fall, and oxygen increases.\r\n\r\n48 hours: Damaged nerve endings start repairing; taste and smell improve.\r\n\r\n1–2 weeks: Lung function increases as inflammation reduces.\r\n\r\n30 days: Circulation improves, breathing becomes easier, and coughing episodes decline.\r\n\r\nBeyond the physical benefits, cessation significantly reduces the risk of:\r\n\r\nCoronary artery disease\r\n\r\nChronic obstructive pulmonary disease (COPD)\r\n\r\nStroke\r\n\r\nMultiple cancers including lung, throat, and pancreatic\r\n\r\nSmoking cessation is the single most impactful intervention a smoker can make—more effective than any medical procedure at extending life expectancy.	Live	\N	\N	\N	{"Health-Professional Tone"}	2025-12-04 11:47:18.806401	2025-12-04 11:47:18.806401
4cdd1bed-8115-4a6c-8f3d-36a3c39383cf	5 Healthy Habits That Replace the Smoking Routine Without Feeling Like a Sacrifice	Blog	\N	Quitting isn’t just removing a habit—it’s replacing it with something better. Here are five lifestyle swaps that make the transition smooth:\r\n\r\nThe Craving Walk\r\nWhen urges hit, take a 3-minute fast walk. It interrupts the trigger loop and releases dopamine naturally.\r\n\r\nHydration Reset\r\nA glass of cold water reduces nicotine withdrawal symptoms and refreshes your breathing.\r\n\r\nHands & Mouth Busy Alternatives\r\nHerbal tea, sugar-free mints, or stress balls mimic the physical rituals of smoking.\r\n\r\nBreathing Rituals\r\nReplace the inhale–exhale pattern of smoking with slow breathing that actually calms your nervous system.\r\n\r\nMicro Rewards\r\nEvery smoke-free day = one small reward. You’re rewiring your brain through positive reinforcement.\r\n\r\nQuitting can feel good when you choose habits that nourish rather than restrict.	Live	\N	\N	\N	{"Wellness Blog"}	2025-12-04 11:47:39.17314	2025-12-04 11:47:39.17314
fce9631a-cb21-4795-9719-69e9891cd8a8	Ashes on the Wind: A Short Story About Letting Go	Blog	\N	Ravi kept his last cigarette in his pocket like a memory—of late-night conversations, of heartbreak, of escapes he didn’t want to admit were slowly trapping him. He wasn’t ready to quit, not really. But when his daughter handed him a crayon drawing of a superhero with the words ‘Papa, I want you to live forever’, something shifted.\r\n\r\nThat night, Ravi walked to the balcony, felt the winter breeze, and held the cigarette between his fingers one last time.\r\nHe didn’t light it.\r\n\r\nInstead, he broke it in half.\r\nThe sound was soft—almost too small for such a big decision.\r\n\r\nAs the pieces fell to the ground, he whispered, “For you. And for me.”\r\n\r\nFor the first time in years, he breathed deeply, without smoke.\r\nAnd it felt like freedom.	Live	\N	\N	\N	{"Fictional Short Story"}	2025-12-04 11:48:04.459207	2025-12-04 11:48:04.459207
ec203280-e85e-4698-b67b-c7384b531b94	What the Latest Research Says About Cravings—and How to Outsmart Them	Blog	\N	Cravings are not random bursts of weakness. According to recent behavioral neuroscience studies, cravings follow a predictable pattern driven by dopamine spikes and conditioned routines.\r\nResearchers now identify three main craving types:\r\n\r\nEmotional Cravings – triggered by stress, loneliness, or boredom\r\n\r\nSituational Cravings – after meals, during breaks, or while socializing\r\n\r\nEnvironmental Cravings – seeing other smokers, familiar places, or routines\r\n\r\nThe good news?\r\nStudies show that cravings rarely last more than 3–5 minutes when not reinforced.\r\n\r\nYou can “surf the urge” by:\r\n\r\nNaming the feeling (“This is a craving, not a need”)\r\n\r\nDoing a quick distraction activity\r\n\r\nSwitching the environment briefly (walk, water, breathing)\r\n\r\nScience proves: cravings are temporary. Your decision to quit can be permanent.	Live	\N	\N	\N	{"Evidence-Driven Blog"}	2025-12-04 11:54:56.017917	2025-12-04 11:54:56.017917
8dcb6827-3c71-49e5-a99e-bb0c09926506	Quitting Smoking? Here Are 7 Things Nobody Tells You—but You Should Know!	Blog	\N	Everyone tells you “quitting is good for you,” but nobody warns you about the weird, funny, surprising parts:\r\n\r\nFood tastes ridiculously good\r\n\r\nYou might become obsessed with scented candles\r\n\r\nYour sleep improves (but dreams get wild for a bit)\r\n\r\nYou start noticing other people’s smoke a lot\r\n\r\nYour morning cough disappears, and it feels like magic\r\n\r\nYou save more money than you expected\r\n\r\nYou start cheering yourself on for small wins\r\n\r\nQuitting isn’t a punishment—it’s a glow-up.\r\nThe first week is the toughest, but it comes with unexpected, funny milestones. And honestly? You’re stronger than any craving.	Live	\N	\N	\N	{"Conversational Blog"}	2025-12-04 11:55:19.647991	2025-12-04 11:55:19.647991
83cb19b0-8d28-4bc0-9c72-5b511da6c5e1	How Workplaces Can Support Smoking Cessation and Boost Team Productivity	Blog	\N	Employee wellbeing directly impacts productivity, retention, and culture. Organizations that integrate smoking cessation programs often see:\r\n\r\nLower sick leave rates\r\n\r\nHigher concentration and energy levels\r\n\r\nBetter team morale\r\n\r\nReduced healthcare costs\r\n\r\nEffective workplace initiatives include:\r\n\r\nOn-site counseling or virtual quit coaches\r\n\r\nSmoke-free zones and designated support groups\r\n\r\nReward systems for milestones\r\n\r\nAccess to quitting tools (NRTs, apps, etc.)\r\n\r\nStress-management workshops\r\n\r\nA healthy workforce is a high-performing workforce.\r\nSmoking cessation is not just a personal choice—it’s a strategic investment for companies.	Live	\N	\N	\N	{"Wellness Blog"}	2025-12-04 11:55:41.80804	2025-12-04 11:55:41.80804
17e32b36-6821-466f-aa03-e4372fb0631b	It’s Okay If You Failed Before—Here’s Why Your Next Quit Attempt Can Succeed”	Blog	\N	Many people feel ashamed after relapsing. But the truth?\r\nMost ex-smokers quit on their 5th to 7th attempt.\r\n\r\nEvery slip teaches something:\r\n\r\nWhich triggers hit hardest\r\n\r\nHow stress impacts your willpower\r\n\r\nWhat routines need replacing\r\n\r\nWhich people or environments make quitting easier\r\n\r\nThink of it like learning to ride a bicycle. You don’t fail—you practice.\r\nEach attempt strengthens your quit muscle.\r\n\r\nYour next attempt doesn’t start from scratch.\r\nIt starts from experience.	Live	\N	\N	\N	{"Relatable Blog"}	2025-12-04 11:56:01.893834	2025-12-04 11:56:01.893834
72575723-ad86-4b95-a3b7-9b891c726bb4	A Step-by-Step 7-Day Preparation Plan Before You Quit	Blog	\N	Quitting cold one morning sounds heroic—but preparation dramatically increases success rates. Here’s a practical 7-day plan:\r\n\r\nDay 1: Write your “Why I’m quitting” list\r\nDay 2: Identify your smoking triggers\r\nDay 3: Remove ashtrays, lighters, and packs from your spaces\r\nDay 4: Buy your quit aids (gum, inhaler, patches, herbal tea)\r\nDay 5: Tell 2–3 supportive people about your quit date\r\nDay 6: Practice dealing with a craving (role-play a trigger)\r\nDay 7: Set your Quit Day and plan your morning routine\r\n\r\nBy the time your Quit Day arrives, your mind and environment are ready.\r\nPreparation = power.	Live	\N	\N	\N	{"“How-To” Blog"}	2025-12-04 11:56:21.992232	2025-12-04 11:56:21.992232
16b356b7-59c3-4c13-bc18-571c98daeb37	cotine Is Not the Villain: What Big Pharma Hides From Parents | Dr. Bryan Ardis, DC	Podcast	\N		Live	\N	\N	https://youtu.be/JyyxUCdbcn8	{}	2025-12-04 11:58:16.551916	2025-12-04 11:58:16.551916
3c3a090c-ba12-4889-b95d-f362c65c1ae7	Nicotine Patches and Unspoken Benefits	Podcast	\N		Live	\N	\N	https://youtu.be/wKTsq0DXGIM	{}	2025-12-04 11:58:38.183686	2025-12-04 11:58:38.183686
1c14c6ed-2bab-4911-a18b-9955cf50d782	Smoking vs Vaping - Which Is Worse?	Podcast	\N		Live	\N	\N	https://youtu.be/QQ6830trCjc	{}	2025-12-04 12:38:29.754455	2025-12-04 12:38:29.754455
d7a796e3-ef6b-4394-a454-7ddb3eef0779	Chris Herren Speaking on His Addiction Recovery Story | PeaceLove	Podcast	\N		Live	\N	\N	https://youtu.be/E_18V7klRY8	{}	2025-12-04 12:39:14.293745	2025-12-04 12:39:14.293745
d98e9be7-75ce-464d-85a9-560857fabcc1	What Happens When You Stop Smoking?	Podcast	\N		Live	\N	\N	https://youtu.be/o3I0mJ2RfU0	{}	2025-12-04 12:39:40.905327	2025-12-04 12:39:40.905327
7744893b-f020-4861-9b06-f584c7c780ce	w Cigarettes Is Made In Factory? Captain Discovery	Video	\N		Live	\N	\N	https://youtu.be/HqhjQeu24Vk	{}	2025-12-04 12:41:40.441035	2025-12-04 12:41:40.441035
230c5e10-c907-4e6f-9720-5ba67333318b	ow Smoking Kills? (3D Animation)	Video	\N		Live	\N	\N	https://youtu.be/oizxjApBviU	{}	2025-12-04 12:43:10.02079	2025-12-04 12:43:10.02079
6b274131-3c7d-4bcb-b067-b239a68bccc2	What Happens When You Quit Smoking | [Smoking Quit Effects In Hindi] Dr. Richa Tiwari	Video	\N		Live	\N	\N	https://youtu.be/4rUktRipN4U	{}	2025-12-04 12:43:37.915531	2025-12-04 12:43:37.915531
4d1dfa88-1085-4b06-a2fa-48b673b888a7	Why India LOVES smoking? | Smoking is COOL | Abhi and Niyu	Video	\N		Live	\N	\N	https://youtu.be/n5KmyQmSyvs	{}	2025-12-04 12:44:13.805621	2025-12-04 12:44:13.805621
d5cee1a0-8f7b-4991-92d5-a027868a4f6d	MensXP: Types Of Smokers We All Know | Types Of People While Smoking	Video	\N		Live	\N	\N	https://youtu.be/BYaM9si-aAA	{}	2025-12-04 12:44:44.982431	2025-12-04 12:44:44.982431
3ea0103e-c014-4bef-a20f-5749fbcde971	breaking the habit	Image	\N		Live	\N	\N	https://imgs.search.brave.com/gkgMlp_Xg5a_QP9_XvIQWcU4R95DxwMJap1SqdnCJoI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTcx/NTg5NjQvcGhvdG8v/YnJlYWtpbmctdGhl/LWhhYml0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1iSUoy/Rm9ndzhSNHJqd2U2/ODFCWC1HaHp4Y0hY/dkFLN3g0OFJFeXow/NVZFPQ	{image}	2025-12-04 12:51:51.734078	2025-12-04 12:51:51.734078
e083a9df-4af0-4930-a65a-d058b567f236	wertyut	Image	\N		Live	\N	\N	http://localhost:5000/uploads/content/Screenshot from 2025-12-09 14-11-27-1765276258507-519447024.png	{}	2025-12-09 16:00:58.512195	2025-12-09 16:00:58.512195
\.


--
-- Data for Name: notification_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification_templates (id, key, title, default_time, is_active, created_at, updated_at) FROM stdin;
1	daily_motivation	Daily Motivational Reminder	09:00:00	t	2025-11-26 15:38:25.177765	2025-11-26 15:38:25.177765
2	progress_checkin	Progress Check-In (Evening)	20:00:00	t	2025-11-26 15:38:25.177765	2025-11-26 15:38:25.177765
3	weekly_tip	Weekly Tip	10:00:00	t	2025-11-26 15:38:25.177765	2025-11-26 15:38:25.177765
\.


--
-- Name: assessment_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assessment_questions_id_seq', 57, true);


--
-- Name: content_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.content_items_id_seq', 21, true);


--
-- Name: notification_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notification_templates_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--

\unrestrict c6hjm0ILLIb0PP0bBaj0v3GkSr7KSvEiGCcH8OUHGzxjpUfWzCcxaOog41XUbxu

