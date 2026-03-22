# C1 Advanced Exam Webapp — Full Conversation Summary — 2026-03-21

## Project overview

You are building a **Cambridge C1 Advanced exam practice webapp** focused on practicing test parts individually, with a polished UI and a strong architecture that looks professional in a portfolio.

The app is intended to generate practice content for **Reading & Use of English** and **Writing** first, with strict structured outputs, proper validation, saved attempts, review functionality, and user statistics.

This is a **monorepo** project.

---

# Monorepo structure

We decided the project should be a monorepo with this top-level structure:

```text
c1-advanced-webapp/
├── backend/
├── frontend/
└── docs/
```

Purpose of each folder:

- `backend/` → Django + DRF API
- `frontend/` → React + TypeScript webapp
- `docs/` → architecture docs, API notes, schema docs, design decisions, prompts, summaries

You explicitly liked this structure and wanted both backend and frontend to be modularized as much as reasonably possible.

---

# Product scope

## v1 scope

The initial scope is:

- **Reading & Use of English**
  - Part 1
  - Part 2
  - Part 3
  - Part 4
  - Part 5
  - Part 6
  - Part 7
  - Part 8

- **Writing**
  - Part 1
  - Part 2

## explicitly not in v1

- Listening
- Speaking
- hints
- streaming partial AI responses
- Docker was initially not required, but later became required because of local Postgres installation issues on Mac

---

# Core product decisions

## generation style

The app will generate **part-by-part**, not a giant full test blob.

That means:

- generate one P1 section
- generate one W1 section
- etc.

This was an intentional architecture decision for flexibility, validation, easier retries, and cleaner UI/UX.

## strict structured output

The backend will require structured JSON output for:

- generated sections
- answer keys
- writing feedback

The model is not allowed to return loose prose blobs. The app architecture assumes strict machine-usable JSON.

## objective parts store answer keys at generation time

For Reading & Use of English sections, the generated section content must include both:

- the content/questions
- the correct answers

This means that when the user submits answers:

- the backend already has the answer key
- it does **not** need to call the model again for grading

This was an explicit requirement you restated later.

## writing grading is model-based

Writing submissions will be sent to the model for evaluation and structured feedback.

## UK spelling

UK spelling is enforced.

## typed code everywhere

You explicitly said you do not want `any` types anywhere in the codebase.

The goal is:

- typed backend
- typed frontend
- clean, professional code suitable for showing to companies

---

# Tech stack

## frontend

- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui

You already created the barebones React app in `frontend/` and confirmed Tailwind v4 + shadcn/ui are working.

## backend

- Django
- Django REST Framework
- PostgreSQL
- JWT auth
- Anthropic API for generation/evaluation

## backend libraries decided

Initial installed packages:

- `django`
- `djangorestframework`
- `psycopg[binary]`
- `gunicorn`
- `python-dotenv`

Additional recommended/decided packages:

- `django-cors-headers`
- `djangorestframework-simplejwt`
- `drf-spectacular`
- `pytest`
- `pytest-django`
- `ruff`
- `mypy`
- `anthropic`

## env loading

You initially asked about the env library and later remembered the one you’re used to:

- **`python-dotenv`**

We chose to use `python-dotenv` since you are already comfortable with it.

I had mentioned `django-environ` as an alternative, but the final choice for this project was **`python-dotenv`**.

---

# Authentication decisions

## auth style

- email/password auth only
- custom Django user model from day 1
- JWT auth

You explicitly agreed to:

- custom user model
- email/password only
- no username-based login as the main auth mechanism

## JWT

You had already previously agreed JWT was fine, and we kept that decision here.

## auth endpoints planned

The auth endpoints planned are:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

These were locked as the next major vertical slice after infra was working.

---

# ID strategy

We decided to use **UUIDs** for main domain models.

UUIDs are intended for:

- `User`
- `Exam`
- `ExamSection`
- `SectionAttempt`
- `WritingSubmission`
- `ReviewItem`

You explicitly said UUIDs were fine.

---

# API generation/evaluation strategy

## Anthropic integration

The backend will integrate with the **Anthropic API** server-side only.

The frontend will never call Anthropic directly.

## synchronous generation/evaluation for v1

For v1:

- generation is synchronous
- writing evaluation is synchronous
- frontend shows loading spinners while waiting

You explicitly wanted:

- no streaming if it reduces reliability
- normal loading states/spinners are fine

## no Celery/Redis in v1

We explicitly decided:

- no Redis
- no Celery
- no background job system in v1

This keeps the project simpler until async infrastructure is genuinely needed.

---

# Pre-creating exam sections

We discussed two options:

## Option A

Create `ExamSection` rows only when a section is generated.

## Option B

Create all selected `ExamSection` rows immediately when the exam is created.

You chose **Option B**.

### Final decision

When an exam is created:

- create the `Exam`
- pre-create one `ExamSection` row for every selected part
- initial section status is `pending`

### Why this was chosen

Because it makes:

- exam structure visible immediately
- UI progress easier
- persistence cleaner
- future regeneration logic easier
- stats and history easier later

---

# Attempts / retries decision

We discussed whether sections should support multiple attempts.

## Final decision

- technically allow multiple attempts in the data model
- mark the first one as `is_official=True`
- in v1 UI, treat it as a single official attempt workflow

This was chosen because:

- you wanted the stored generated content and answer key to remain in the DB
- the user should be able to revisit or re-attempt later
- we want v2 flexibility without a painful refactor

So the schema is future-proof, while v1 UX stays simple.

---

# Section generation behavior

## generating the same part multiple times

You clarified that:

- yes, users can create multiple exams
- each exam can contain a part like P1 independently
- once a section is generated inside an exam, it should stay attached to that exam
- if the user wants another P1, they can create another exam rather than overwrite the existing one

### Final decision

A generated section remains persisted for that exam.

### regeneration policy

We discussed a possible rule:

- if section is `pending` or `failed`, generate is allowed
- if already `ready`, reject unless a force option exists

But your actual preference leaned toward:

- keep generated content persistent
- avoid overwriting
- create another exam for a fresh version

So the architecture should preserve generated sections rather than casually overwrite them.

---

# Writing-specific decisions

## Writing Part 1

- essay only

You explicitly confirmed this.

## Writing Part 2

Allowed task types only from the approved Cambridge-style set, such as:

- review
- report
- letter
- email
- and other allowed non-essay formats

You explicitly said:

- there should not be essays in Writing Part 2
- essay belongs to Writing Part 1

## Writing Part 2 prompts

We locked:

- one generated W2 section contains **3 prompts**
- the user chooses one prompt when submitting

---

# Type system strategy

We discussed two options:

## Option A

Manual TypeScript types

## Option B

Generate TypeScript types from backend OpenAPI later

### Final decision

For now:

- write **manual TS types**
- no `any`
- likely use discriminated unions for section payloads
- maybe generate types from OpenAPI later if desired

You explicitly agreed to manual types.

---

# Backend architecture

## backend app structure

We decided to use multiple Django apps:

- `accounts`
- `exams`
- `generation`
- `review`
- `stats`

You explicitly liked the separation and said modularization is good.

## responsibilities of each backend app

### `accounts`

Responsible for:

- custom user model
- auth endpoints
- registration
- login/me
- JWT-related integration

### `exams`

Responsible for:

- `Exam`
- `ExamSection`
- `SectionAttempt`
- `WritingSubmission`
- exam creation
- section retrieval
- submission endpoints

### `generation`

Responsible for:

- Anthropic client
- prompt builders
- response parsing
- schema validation
- mock generators
- generation service logic

### `review`

Responsible for:

- `ReviewItem`
- review queue
- spaced repetition skeleton
- incorrect answer review workflows

### `stats`

Responsible for:

- aggregate stats
- overview stats
- part breakdown stats
- writing stats later

---

# Final desired backend folder structure

This was the detailed structure we settled on conceptually:

```text
c1-advanced-webapp/
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   │   ├── migrations/
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   ├── views.py
│   │   │   └── tests/
│   │   ├── exams/
│   │   │   ├── migrations/
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── constants.py
│   │   │   ├── models.py
│   │   │   ├── selectors.py
│   │   │   ├── serializers.py
│   │   │   ├── services/
│   │   │   │   ├── attempts.py
│   │   │   │   ├── exam_creation.py
│   │   │   │   ├── generation.py
│   │   │   │   ├── grading.py
│   │   │   │   └── writing.py
│   │   │   ├── urls.py
│   │   │   ├── views.py
│   │   │   └── tests/
│   │   ├── generation/
│   │   │   ├── apps.py
│   │   │   ├── client.py
│   │   │   ├── constants.py
│   │   │   ├── mock_generators.py
│   │   │   ├── prompt_builders.py
│   │   │   ├── response_parsers.py
│   │   │   ├── schemas/
│   │   │   ├── validators/
│   │   │   └── tests/
│   │   ├── review/
│   │   │   ├── migrations/
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── services.py
│   │   │   ├── urls.py
│   │   │   ├── views.py
│   │   │   └── tests/
│   │   └── stats/
│   │       ├── apps.py
│   │       ├── serializers.py
│   │       ├── selectors.py
│   │       ├── urls.py
│   │       ├── views.py
│   │       └── tests/
│   ├── config/
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── dev.py
│   │   │   └── prod.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── requirements/
│   │   ├── base.txt
│   │   ├── dev.txt
│   │   └── prod.txt
│   ├── .env.example
│   ├── manage.py
│   ├── pyproject.toml
│   └── pytest.ini
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── exam/
│   │   │   ├── writing/
│   │   │   ├── review/
│   │   │   └── stats/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── exams/
│   │   │   ├── review/
│   │   │   └── stats/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   ├── package.json
│   └── tsconfig.json
│
└── docs/
    ├── architecture/
    ├── api/
    ├── schemas/
    ├── prompts/
    └── decisions/
```

Important note: the actual current implementation is still earlier than this full target structure. At the moment, the backend still has a single `settings.py`, not split `settings/base.py`, etc. That split was discussed as a future cleanup, not yet done.

---

# Frontend architecture

We decided frontend should also be modular.

## frontend feature split

### `features/auth`

- login
- register
- auth state
- token handling
- me query
- protected routing

### `features/exams`

- create exam
- exam detail
- section generation
- submission flows
- section status

### `features/review`

- review queue
- review submission
- review stats

### `features/stats`

- overview stats
- charts/cards
- per-part analytics
- writing analytics later

## shared components

The UI will later have shared reusable components such as:

- `SectionCard`
- `TimerBar`
- `WordCountBadge`
- `LoadingPanel`
- `InstructionBox`

## part-specific UI

You also explicitly wanted exam-like friendly UI, for example:

- multiple choice should feel like selecting an answer in a clean exam component
- RUoE parts should display labels like:
  - “RUoE Part 1: Multiple-choice cloze”

That was explicitly mentioned by you.

---

# Core enums and constants

## Part codes

We locked these part codes:

- `P1`
- `P2`
- `P3`
- `P4`
- `P5`
- `P6`
- `P7`
- `P8`
- `W1`
- `W2`

## section types

- `ruoe`
- `writing`

## exam statuses

We discussed and recommended:

- `draft`
- `generating`
- `ready`
- `in_progress`
- `completed`

Earlier simpler variants also included just:

- `draft`
- `in_progress`
- `completed`

The more detailed set is available for flexibility.

## section statuses

Locked/recommended statuses:

- `pending`
- `generating`
- `ready`
- `failed`
- `submitted`
- `graded`

## exam modes

From the earlier architecture:

- `budget`
- `quality`

## difficulty

From the earlier architecture:

- `c1_low`
- `c1_mid`
- `c1_high`

## canonical order of parts

We agreed that if the user sends parts in random order, the backend should sort them into canonical order:

1. `P1`
2. `P2`
3. `P3`
4. `P4`
5. `P5`
6. `P6`
7. `P7`
8. `P8`
9. `W1`
10. `W2`

You explicitly said yes, order them.

---

# Final DB schema

## `accounts.User`

We decided to create a custom user model from day one.

Implemented direction:

- UUID primary key
- unique email
- email used as auth identifier

The model created in the conversation was:

- inherits from `AbstractUser`
- adds:
  - `id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)`
  - `email = EmailField(unique=True)`

- `USERNAME_FIELD = "email"`
- `REQUIRED_FIELDS = ["username"]`

This keeps username present for compatibility, but uses email login.

## `exams.Exam`

Final intended fields:

- `id: UUID`
- `user: FK -> User`
- `title: CharField(blank=True)`
- `mode`
- `difficulty`
- `timer_enabled`
- `ruoe_timer_minutes`
- `writing_timer_minutes`
- `planning_help_enabled`
- `uk_spelling`
- `selected_parts: JSONField`
- `status`
- `created_at`
- `updated_at`

## `exams.ExamSection`

Final intended fields:

- `id: UUID`
- `exam: FK -> Exam`
- `part_code`
- `section_type`
- `status`
- `generator_version`
- `title`
- `instructions`
- `topic`
- `difficulty`
- `content_json`
- `answer_key_json`
- `meta_json`
- `raw_model_output`
- `prompt_log_json`
- `generated_at`
- `created_at`
- `updated_at`

Constraint:

- unique `(exam, part_code)`

## `exams.SectionAttempt`

Final intended fields:

- `id: UUID`
- `section: FK -> ExamSection`
- `user: FK -> User`
- `attempt_number`
- `is_official`
- `started_at`
- `submitted_at`
- `time_spent_seconds`
- `answers_json`
- `score`
- `max_score`
- `results_json`
- `created_at`
- `updated_at`

This model is meant for objective sections.

## `exams.WritingSubmission`

Final intended fields:

- `id: UUID`
- `section: FK -> ExamSection`
- `user: FK -> User`
- `attempt_number`
- `is_official`
- `chosen_prompt_key`
- `text`
- `word_count`
- `time_spent_seconds`
- `submitted_at`
- `feedback_json`
- `score_json`
- `raw_model_output`
- `prompt_log_json`
- `created_at`
- `updated_at`

This model is meant for writing submissions.

## `review.ReviewItem`

Final intended fields:

- `id: UUID`
- `user: FK -> User`
- `source_section: FK -> ExamSection`
- `source_attempt: FK -> SectionAttempt`
- `source_question_id`
- `part_code`
- `prompt_snapshot_json`
- `correct_answer_json`
- `user_answer_json`
- `explanation_json`
- `times_seen`
- `times_correct`
- `last_reviewed_at`
- `next_review_at`
- `ease_factor`
- `interval_days`
- `status`
- `created_at`
- `updated_at`

This provides the future spaced-repetition skeleton.

---

# Section wrapper contract

We agreed that generated sections should follow a **common wrapper** with part-specific content inside.

The wrapper concept includes:

- `section_id`
- `part_code`
- `section_type`
- `title`
- `instructions`
- `topic`
- `difficulty`
- `uk_spelling`
- `content`
- `answer_key`
- `meta`

This wrapper should be common, while `content` and `answer_key` are specific to the part.

This was chosen instead of one giant cursed mega-schema.

---

# API design

## generalized generation endpoint

You explicitly requested that instead of hardcoded endpoints like:

- `POST /api/exams/{id}/sections/P1/generate`

we should use a generalized endpoint:

- `POST /api/exams/{exam_id}/sections/{part_code}/generate`

This was accepted and locked as the better design.

## auth endpoints

Locked/planned:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

## exam endpoints

Locked/planned:

- `POST /api/exams/`
- `GET /api/exams/`
- `GET /api/exams/{exam_id}/`
- `DELETE /api/exams/{exam_id}/`

## section endpoints

Locked/planned:

- `GET /api/exams/{exam_id}/sections/`
- `GET /api/exams/{exam_id}/sections/{part_code}/`
- `POST /api/exams/{exam_id}/sections/{part_code}/generate`

Possible future endpoint:

- `POST /api/exams/{exam_id}/generate` for batch generation of all selected sections

## objective submission endpoint

Locked/planned:

- `POST /api/sections/{section_id}/submit`

Earlier we had discussed a more explicit name:

- `POST /api/sections/{section_id}/submit-objective`

But the later simplified contract leaned toward:

- `POST /api/sections/{section_id}/submit`

## writing submission endpoint

Locked/planned:

- `POST /api/writing/sections/{section_id}/submit`

Earlier we also discussed:

- `POST /api/sections/{section_id}/submit-writing`

The writing-specific route is cleaner and was part of the later locked mapping.

## review endpoints

Locked/planned:

- `GET /api/review/queue`
- `POST /api/review/{review_item_id}/submit`
- `POST /api/review/{review_item_id}/skip`
- `GET /api/review/stats`

## stats endpoints

Locked/planned:

- `GET /api/stats/overview`
- `GET /api/stats/parts/{part_code}`
- `GET /api/stats/writing`

## API docs/schema endpoints

Implemented/planned:

- `GET /api/schema/`
- `GET /api/docs/`

Optional later:

- `GET /api/redoc/`

You explicitly said you wanted API schema/docs.

---

# Request/response contract decisions

## exam creation

Exam creation should:

- accept selected parts
- sort them canonically
- create an `Exam`
- pre-create all selected `ExamSection` rows in `pending`
- return exam + section shells

## generate section response

A section generation response should include:

- section id
- part code
- status
- content
- answer key
- metadata

## objective submission

Objective submission should send answers, compare them against stored answer key, and return:

- score
- max score
- question-level results

## writing submission

Writing submission should accept:

- submission text
- chosen prompt key for W2

and return structured feedback.

---

# Objective grading decisions

When submitting RUoE answers, the backend should:

1. load the section
2. ensure it is a `ruoe` section
3. validate question ids and answers
4. normalize answers where needed
5. compare against stored answer key
6. compute score and max score
7. create `SectionAttempt`
8. create `ReviewItem`s for incorrect answers
9. return structured grading results

Important notes:

- objective grading should not require calling the model again
- one point per objective question
- P4 should support normalization rules and possibly multiple accepted answers

---

# Writing evaluation decisions

When submitting writing:

1. validate it is a writing section
2. validate submission text
3. compute word count server-side
4. create `WritingSubmission`
5. call evaluation service
6. validate returned structured feedback
7. save feedback
8. return feedback payload

Writing feedback should be structured, not vague prose.

From earlier architectural requirements, the feedback structure is intended to include things like:

- summary
- strengths
- priority improvements
- paragraph comments
- sentence comments
- rewritten version
- rubric-style scoring

---

# Milestone 1 plan

We agreed that milestone 1 should use **mock data first** so you don’t waste Anthropic tokens while still validating the architecture.

## milestone 1 should include

- monorepo in place
- DRF skeleton running
- React app running
- JWT auth working
- create exam
- generate one P1 section using mock data
- submit P1 answers and score using stored answer key
- generate one W1 section using mock data
- submit W1 writing and return mock structured feedback
- API docs/schema live

## why this milestone

Because it proves:

- backend architecture
- frontend/backend integration
- objective workflow
- writing workflow
- persistence
- review queue creation
- typed contracts

without burning tokens early

---

# Path A decision

We discussed two paths:

## Path A

Do one more design pass for backend foundation, then code.

## Path B

Start coding immediately and define models/contracts along the way.

You chose:

- **Path A first**

So we did another design pass, locking:

- monorepo structure
- app responsibilities
- models
- endpoints
- generation flow
- typing strategy

---

# Tooling decisions

## linting / formatting / typing / tests

We discussed what Ruff does and whether it covers Python type hints.

### Final tooling approach

- **Ruff** → linting + formatting
- **mypy** → static type checking
- **pytest** → tests

You explicitly liked:

- linting
- pytest
- Python type hints

And asked whether Ruff covers type checking. We clarified that it does not fully replace mypy.

---

# Actual implementation progress made in this conversation

This section is very important because it reflects what was not only designed, but actually done.

## 1. Backend DRF skeleton created

You installed:

- `django`
- `djangorestframework`
- `psycopg[binary]`
- `gunicorn`
- `python-dotenv`

Then also added DRF-related packages as recommended.

## 2. Django project created in `backend/`

You wanted:

- Django project created in the root of `backend/`
- React app already in the root of `frontend/`

You created the Django project in `backend/` and confirmed it runs.

## 3. modular Django apps created

You created:

- `apps/accounts`
- `apps/exams`
- `apps/generation`
- `apps/review`
- `apps/stats`

and added `apps/__init__.py`.

## 4. DRF shell working

You configured:

- DRF
- CORS
- drf-spectacular
- health endpoint
- schema/docs endpoints

You confirmed that:

- the app runs
- `/api/docs/` works
- `/api/schema/` works

## 5. custom user model created

Before going further, we intentionally paused and locked the custom user model because that is annoying to change later.

You:

- created `apps/accounts/models.py` with the custom user
- set `AUTH_USER_MODEL`
- deleted `db.sqlite3`
- reran migrations
- confirmed runserver still works

This was an important checkpoint.

---

# Docker and Postgres decision

Initially you said you didn’t need Docker.

Later, because Postgres local install on your Mac was being painful, you decided:

- yes, Docker is needed
- and ideally `docker compose` should run **everything**

You specifically said Siwka told you:

- docker-compose should run everything: postgres, API, frontend, whatever

So we redesigned local dev around Compose.

## Final local dev infra decision

Use Docker Compose for:

- Postgres
- Django backend
- React frontend

Run the whole stack with one command:

- `docker compose up --build`

---

# Docker / Compose files created

We created conceptually and you implemented:

## root-level Compose file

- `compose.yaml`

## backend Docker files

- `backend/Dockerfile`
- `backend/.dockerignore`

## frontend Docker files

- `frontend/Dockerfile`
- `frontend/.dockerignore`

### backend Dockerfile

Uses:

- `python:3.13-slim`
- installs `build-essential` and `libpq-dev`
- copies `requirements.txt`
- installs dependencies
- copies app code

### frontend Dockerfile

Uses:

- `node:22-alpine`
- copies package files
- runs `npm install`
- copies app files

### Compose services

We defined:

- `db`
- `backend`
- `frontend`

with a named Postgres volume:

- `postgres_data`

---

# Env variable decisions for Docker

We discovered an important distinction:

## root `.env`

Needed for Compose interpolation in `compose.yaml`:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

## `backend/.env`

Needed for Django settings inside the backend container:

- Django settings vars
- DB connection vars

This distinction only surfaced after Compose warnings showed `${POSTGRES_*}` was not set.

---

# Docker problems encountered and fixed

## 1. missing `compose.yaml`

At first:

- `docker compose up --build`
  failed with:
- `no configuration file provided: not found`

Cause:

- no Compose file existed yet

Fix:

- create `compose.yaml` in repo root

## 2. Docker credential helper error

You got:

- `docker-credential-desktop: executable file not found in $PATH`

Cause:

- `~/.docker/config.json` had stale Docker credential helper config
- specifically:
  - `credsStore`
  - `currentContext`

We discussed that Docker CLI uses `credsStore` to invoke a helper like `docker-credential-desktop`.

### Fix you applied

You deleted:

- `credsStore`
- `currentContext`

from `~/.docker/config.json`

and that fixed the credential issue.

## 3. Postgres port conflict

After Docker was building correctly, you got:

- `address already in use` on port `5432`

Cause:

- something on your Mac was already using host port `5432`

### Fix

We removed the exposed Postgres host port mapping from Compose entirely, because:

- backend talks to Postgres internally over Docker network using host `db`
- you don’t need host exposure for app functionality right now

That resolved the conflict.

---

# Current Docker status

At the end of the conversation, the Docker stack is working.

From your screenshot/logs:

- backend container is running
- migrations are applying to Postgres
- Django dev server is running in Docker
- `/api/docs/` returns 200
- `/api/schema/` returns 200

The stack is alive.

Notes from logs:

- `GET /` gives 404, which is expected because no root route exists yet
- `HealthCheckView` produced a drf-spectacular serializer warning, but it is non-fatal and can be cleaned up later

---

# Current actual backend file tree status

At the moment, your backend tree looks roughly like this:

```text
backend/
├── .venv/
├── apps/
│   ├── accounts/
│   ├── exams/
│   ├── generation/
│   ├── review/
│   ├── stats/
│   └── __init__.py
├── config/
│   ├── __init__.py
│   ├── api_views.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── .env
├── manage.py
├── requirements.txt
└── ...
```

Important note:

- settings are still in one file: `config/settings.py`
- we intentionally did **not** split to `settings/base.py`, etc. yet

---

# Current recommended next steps

At the end of the conversation, the strongest recommendation was:

## Next major step: auth vertical slice

Implement:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

And specifically:

1. configure DRF default auth/permissions
2. create `accounts/serializers.py`
3. create `accounts/views.py`
4. create `accounts/urls.py`
5. wire auth urls into `config/urls.py`
6. create a superuser
7. test register/login/me via Swagger/docs

## Why auth next

Because:

- exams belong to users
- attempts belong to users
- review queue belongs to users
- stats belong to users

Auth is the cleanest next vertical slice now that infra is working.

---

# Longer-term next steps after auth

After auth, the recommended sequence is:

## Phase 2: exams skeleton

- implement `Exam`
- implement `ExamSection`
- create exam endpoint
- pre-create section rows

## Phase 3: first objective flow

- mock P1 generator
- section detail retrieval
- submit objective answers
- score against stored answer key
- create review items

## Phase 4: first writing flow

- mock W1 generator
- submit writing
- return mock structured feedback

This sequence was chosen as the cleanest way to validate the architecture.

---

# Important implementation principles locked in this chat

These are the higher-level principles we repeatedly aligned on:

1. **Ask rather than guess**
   - You explicitly said you always prefer being asked questions instead of someone guessing what you want.

2. **Keep the code portfolio-quality**
   - modular
   - typed
   - clean
   - no `any`
   - structured
   - good architecture

3. **Avoid premature overengineering**
   - no Celery/Redis now
   - no generated TS types now
   - no production deployment setup yet
   - use mock generators first

4. **Preserve future flexibility**
   - multiple attempts supported in schema
   - pre-created sections
   - part-by-part generation
   - strong separation of concerns

5. **Prioritize risky irreversible decisions early**
   - especially custom user model before deeper app work

---

# Short “state of the project right now”

At the end of this conversation, the project is in this state:

## done

- monorepo direction decided
- frontend exists and runs
- backend exists and runs
- modular Django apps created
- custom user model created
- DRF wired up
- API docs/schema wired up
- Docker Compose created
- Postgres running in Docker
- Django running in Docker
- frontend running in Docker
- backend now talks to Postgres in Docker

## not done yet

- auth endpoints
- exam models
- exam creation endpoint
- section generation endpoint
- mock generators
- submission/grading endpoints
- review model and endpoints
- stats endpoints
- Anthropic integration
- frontend feature implementation
- shared TS API types
- test suite
- lint/typecheck config files
- settings split (`base.py`, `dev.py`, `prod.py`)

---

# Recommended doc file names for saving this summary

If you want to add this to `docs/`, good filenames would be something like:

- `docs/decisions/project-summary-2026-03-22.md`
- `docs/architecture/current-state-summary.md`
- `docs/decisions/conversation-summary-foundation.md`

---

# Final high-confidence next action

The exact next implementation step after this summary should be:

## Build auth

- serializers
- views
- URLs
- JWT
- me endpoint
- default DRF auth/permission configuration

That is the best next move.
