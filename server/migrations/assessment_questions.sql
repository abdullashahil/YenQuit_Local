-- Table: public.assessment_questions

-- DROP TABLE IF EXISTS public.assessment_questions;

CREATE TABLE IF NOT EXISTS public.assessment_questions
(
    id integer NOT NULL DEFAULT nextval('assessment_questions_id_seq'::regclass),
    category character varying(50) COLLATE pg_catalog."default" NOT NULL,
    question_text text COLLATE pg_catalog."default" NOT NULL,
    question_type character varying(50) COLLATE pg_catalog."default" DEFAULT 'text'::character varying,
    options jsonb DEFAULT '[]'::jsonb,
    display_order integer DEFAULT 0,
    is_required boolean DEFAULT true,
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT assessment_questions_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.assessment_questions
    OWNER to postgres;
-- Index: idx_assessment_questions_category

-- DROP INDEX IF EXISTS public.idx_assessment_questions_category;

CREATE INDEX IF NOT EXISTS idx_assessment_questions_category
    ON public.assessment_questions USING btree
    (category COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;