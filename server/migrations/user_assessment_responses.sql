-- Table: public.user_assessment_responses

-- DROP TABLE IF EXISTS public.user_assessment_responses;

CREATE TABLE IF NOT EXISTS public.user_assessment_responses
(
    question_id integer NOT NULL,
    response_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    assessment_context character varying(50) COLLATE pg_catalog."default" DEFAULT 'default'::character varying,
    id integer NOT NULL DEFAULT nextval('user_assessment_responses_new_id_seq'::regclass),
    user_id integer,
    CONSTRAINT user_assessment_responses_pkey PRIMARY KEY (id),
    CONSTRAINT uar_unique_response_constraint UNIQUE (user_id, question_id, assessment_context),
    CONSTRAINT user_assessment_responses_question_id_fkey FOREIGN KEY (question_id)
        REFERENCES public.assessment_questions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_assessment_responses_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_assessment_responses
    OWNER to postgres;
-- Index: idx_user_responses_question

-- DROP INDEX IF EXISTS public.idx_user_responses_question;

CREATE INDEX IF NOT EXISTS idx_user_responses_question
    ON public.user_assessment_responses USING btree
    (question_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;