--
-- PostgreSQL database dump
--

\restrict CyBhfrlhTqWp2inwJwVQ8AK5kcqFXEzaM8IuHkFGv2sWM8xSZgoifzH75AmxVck

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

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
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analysis_summary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analysis_summary (
    id bigint NOT NULL,
    channels text,
    conversion_rate character varying(255),
    conversions integer,
    created_at timestamp(6) without time zone,
    job_id bigint NOT NULL,
    recommendations text,
    revenue character varying(255),
    segments text,
    total_rows integer,
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.analysis_summary OWNER TO postgres;

--
-- Name: analysis_summary_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analysis_summary_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.analysis_summary_id_seq OWNER TO postgres;

--
-- Name: analysis_summary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analysis_summary_id_seq OWNED BY public.analysis_summary.id;


--
-- Name: chat_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_history (
    id bigint NOT NULL,
    answer text,
    created_at timestamp(6) without time zone,
    job_id bigint,
    question text,
    user_id bigint
);


ALTER TABLE public.chat_history OWNER TO postgres;

--
-- Name: chat_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_history_id_seq OWNER TO postgres;

--
-- Name: chat_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_history_id_seq OWNED BY public.chat_history.id;


--
-- Name: datasets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.datasets (
    id bigint NOT NULL,
    column_mapping jsonb,
    created_at timestamp(6) without time zone,
    file_name character varying(255) NOT NULL,
    file_path character varying(255) NOT NULL,
    row_count integer,
    status character varying(255),
    user_id bigint
);


ALTER TABLE public.datasets OWNER TO postgres;

--
-- Name: datasets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.datasets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.datasets_id_seq OWNER TO postgres;

--
-- Name: datasets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.datasets_id_seq OWNED BY public.datasets.id;


--
-- Name: job_queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_queue (
    id bigint NOT NULL,
    job_id bigint,
    status character varying(20) DEFAULT 'pending'::character varying,
    retries integer DEFAULT 0,
    max_retries integer DEFAULT 3,
    locked_by character varying(100),
    locked_at timestamp without time zone,
    payload text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.job_queue OWNER TO postgres;

--
-- Name: job_queue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_queue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.job_queue_id_seq OWNER TO postgres;

--
-- Name: job_queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_queue_id_seq OWNED BY public.job_queue.id;


--
-- Name: prediction_job; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prediction_job (
    id bigint NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    dataset_path character varying(500),
    total_records integer DEFAULT 0,
    processed_records integer DEFAULT 0,
    progress double precision DEFAULT 0.0,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp(6) without time zone,
    dataset_id bigint,
    progress_percent real,
    user_id bigint,
    dataset_columns text,
    dataset_type character varying(50),
    id_column character varying(100),
    column_warnings text
);


ALTER TABLE public.prediction_job OWNER TO postgres;

--
-- Name: prediction_job_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prediction_job_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prediction_job_id_seq OWNER TO postgres;

--
-- Name: prediction_job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prediction_job_id_seq OWNED BY public.prediction_job.id;


--
-- Name: prediction_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prediction_results (
    id bigint NOT NULL,
    job_id bigint,
    record_id character varying(100),
    probability double precision,
    segment character varying(20),
    model_version character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    display_id character varying(200)
);


ALTER TABLE public.prediction_results OWNER TO postgres;

--
-- Name: prediction_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prediction_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prediction_results_id_seq OWNER TO postgres;

--
-- Name: prediction_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prediction_results_id_seq OWNED BY public.prediction_results.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    email character varying(255),
    password character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    full_name character varying(50) NOT NULL,
    role character varying(255),
    updated_at timestamp(6) without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ROLE_USER'::character varying, 'ROLE_ADMIN'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: analysis_summary id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysis_summary ALTER COLUMN id SET DEFAULT nextval('public.analysis_summary_id_seq'::regclass);


--
-- Name: chat_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_history ALTER COLUMN id SET DEFAULT nextval('public.chat_history_id_seq'::regclass);


--
-- Name: datasets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.datasets ALTER COLUMN id SET DEFAULT nextval('public.datasets_id_seq'::regclass);


--
-- Name: job_queue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_queue ALTER COLUMN id SET DEFAULT nextval('public.job_queue_id_seq'::regclass);


--
-- Name: prediction_job id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prediction_job ALTER COLUMN id SET DEFAULT nextval('public.prediction_job_id_seq'::regclass);


--
-- Name: prediction_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prediction_results ALTER COLUMN id SET DEFAULT nextval('public.prediction_results_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: analysis_summary analysis_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysis_summary
    ADD CONSTRAINT analysis_summary_pkey PRIMARY KEY (id);


--
-- Name: chat_history chat_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_history
    ADD CONSTRAINT chat_history_pkey PRIMARY KEY (id);


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (id);


--
-- Name: job_queue job_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_queue
    ADD CONSTRAINT job_queue_pkey PRIMARY KEY (id);


--
-- Name: prediction_job prediction_job_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prediction_job
    ADD CONSTRAINT prediction_job_pkey PRIMARY KEY (id);


--
-- Name: prediction_results prediction_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prediction_results
    ADD CONSTRAINT prediction_results_pkey PRIMARY KEY (id);


--
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users uk_r43af9ap4edm43mmtq01oddj6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_job_queue_locked_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_queue_locked_at ON public.job_queue USING btree (locked_at);


--
-- Name: idx_job_queue_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_queue_status ON public.job_queue USING btree (status);


--
-- Name: idx_pred_results_job_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pred_results_job_id ON public.prediction_results USING btree (job_id);


--
-- Name: job_queue update_job_queue_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_job_queue_updated_at BEFORE UPDATE ON public.job_queue FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: prediction_job update_prediction_job_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_prediction_job_updated_at BEFORE UPDATE ON public.prediction_job FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: prediction_job fkh4xoxt74dssv4jec1xqwxxs2t; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prediction_job
    ADD CONSTRAINT fkh4xoxt74dssv4jec1xqwxxs2t FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict CyBhfrlhTqWp2inwJwVQ8AK5kcqFXEzaM8IuHkFGv2sWM8xSZgoifzH75AmxVck

