--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
-- Dumped by pg_dump version 14.2 (Debian 14.2-1.pgdg110+1)

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
-- Name: enum_item_column; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_item_column AS ENUM (
    'TODO',
    'DOING',
    'DONE'
);


ALTER TYPE public.enum_item_column OWNER TO admin;

--
-- Name: enum_item_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_item_type AS ENUM (
    'ISSUE',
    'ALERT'
);


ALTER TYPE public.enum_item_type OWNER TO admin;

--
-- Name: itemcolumn; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.itemcolumn AS ENUM (
    'Todo',
    'Doing',
    'Done'
);


ALTER TYPE public.itemcolumn OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: item; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.item (
    id integer NOT NULL,
    title character varying(255),
    description text,
    complexity integer,
    is_ignored boolean DEFAULT false,
    sentry_id character varying(255),
    sentry_alert_id character varying(255),
    comments json DEFAULT '[]'::json,
    "column" public.enum_item_column DEFAULT 'TODO'::public.enum_item_column,
    assignee_id integer,
    organization_id integer
);


ALTER TABLE public.item OWNER TO admin;

--
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_id_seq OWNER TO admin;

--
-- Name: item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.item_id_seq OWNED BY public.item.id;


--
-- Name: organization; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.organization (
    id integer NOT NULL,
    name character varying(255),
    slug character varying(255),
    external_slug character varying(255)
);


ALTER TABLE public.organization OWNER TO admin;

--
-- Name: organization_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organization_id_seq OWNER TO admin;

--
-- Name: organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.organization_id_seq OWNED BY public.organization.id;


--
-- Name: sentry_installation; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.sentry_installation (
    id integer NOT NULL,
    uuid character varying(255),
    org_slug character varying(255),
    token character varying(255),
    refresh_token character varying(255),
    expires_at timestamp with time zone,
    organization_id integer
);


ALTER TABLE public.sentry_installation OWNER TO admin;

--
-- Name: sentry_installation_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.sentry_installation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sentry_installation_id_seq OWNER TO admin;

--
-- Name: sentry_installation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.sentry_installation_id_seq OWNED BY public.sentry_installation.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying(255),
    username character varying(255),
    avatar character varying(255),
    organization_id integer
);


ALTER TABLE public."user" OWNER TO admin;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO admin;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: item id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.item ALTER COLUMN id SET DEFAULT nextval('public.item_id_seq'::regclass);


--
-- Name: organization id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.organization ALTER COLUMN id SET DEFAULT nextval('public.organization_id_seq'::regclass);


--
-- Name: sentry_installation id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sentry_installation ALTER COLUMN id SET DEFAULT nextval('public.sentry_installation_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.item (id, title, description, complexity, is_ignored, sentry_id, sentry_alert_id, comments, "column", assignee_id, organization_id) FROM stdin;
7	IndexError: list index is out of range	#onboarding #first-task Seems to be a quick fix we can pass on to a new hire.	1	f	\N	\N	[]	DOING	4	1
2	UnauthorizedError: GET /auth/provider/ 401	The users who trigger this error are doing so via the CLI, was there a breaking change?	3	f	\N	\N	[]	DOING	3	1
3	TypeError: Unhashable type: 'dict'	This is preventing new rows from being written to the ProjectSettings table, can someone from #incidents take this on ASAP?	5	f	\N	\N	[]	DONE	2	1
5	RestrictedIPAddress: pirate.proxy/portal matches the URL blacklist	cc @Security, we can probably ignore this one, right? The blacklist works as intended.	1	t	\N	\N	[]	DONE	1	1
4	Organization.DoesNotExist: Organization matching query does not exist.	It's not immediately obvious what the conditions are that triggered this error in the first place, can @reliability team take a look at this?	2	f	\N	\N	[]	TODO	4	1
1	ReferenceError: theme is not defined	This error seems to be triggered whenever a user toggles between dark and light theme too quickly, probably needs some investigation.	3	f	\N	\N	[]	DONE	4	1
6	DatabaseError: ProtocolViolation('idle transaction timeout exceeded')	It looks like the user was accessing their profile through a custom VPN, gonna be difficult to reproduce.	8	f	\N	\N	[]	DOING	1	1
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.organization (id, name, slug, external_slug) FROM stdin;
1	ACME Inc.	acme	\N
\.


--
-- Data for Name: sentry_installation; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.sentry_installation (id, uuid, org_slug, token, refresh_token, expires_at, organization_id) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."user" (id, name, username, avatar, organization_id) FROM stdin;
1	Alison Kihn	Alison69@yahoo.com	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/815.jpg	1
2	Angelina Olson	Angelina37@hotmail.com	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/959.jpg	1
3	Merlin Metz	Merlin.Metz91@hotmail.com	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/537.jpg	1
4	Era Konopelski	Era48@gmail.com	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/799.jpg	1
\.


--
-- Name: item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.item_id_seq', 20, true);


--
-- Name: organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.organization_id_seq', 1, true);


--
-- Name: sentry_installation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.sentry_installation_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_id_seq', 4, true);


--
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: sentry_installation sentry_installation_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sentry_installation
    ADD CONSTRAINT sentry_installation_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: item item_assignee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: item item_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sentry_installation sentry_installation_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sentry_installation
    ADD CONSTRAINT sentry_installation_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user user_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

