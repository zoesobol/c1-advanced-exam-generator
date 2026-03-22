# Conversation summary: exams backend + frontend P1 mock vertical slice

## High-level goal of this phase

The goal of this conversation was to move forward from the already-working auth slice into the **first real exam vertical slice**, using a **hardcoded mock** instead of Anthropic for now.

We decided that the best next step was to implement:

- backend exam domain
- one real section flow for **P1**
- polished frontend from the start
- mobile-first layout
- dark mode toggle
- section navigation
- objective submission + scoring + explanations

The purpose was to validate the product architecture end to end before adding model-based generation.

---

# What was already true at the start

At the beginning of this conversation, the project already had:

- monorepo structure with `backend/` and `frontend/`
- Django + DRF backend running in Docker
- React + TypeScript frontend running in Docker
- auth already implemented and working
- JWT auth already wired
- protected dashboard route already existing
- public GitHub repo already created
- architecture docs and prior summaries available

So this conversation started at the point where the foundation and auth slice were complete, and the next decision was what the first feature slice should be.

---

# Main product / architecture decisions we made

## 1. First real feature slice should be P1 with a mock

We agreed the first real vertical slice should be:

- create exam
- create section shells
- generate only **P1**
- render section
- submit answers
- score answers against stored answer key
- show explanations

We explicitly decided **not** to add Anthropic yet, because the mock-based slice is the best way to validate the architecture without adding token cost or generation complexity.

---

## 2. Frontend should already feel polished

You requested that even the first UI version should already be polished, not just a bare prototype.

So we committed to:

- polished UI from the start
- mobile-first design
- navbar
- section navigation
- dark mode toggle
- structured frontend folders
- not dumping everything into one messy `src/`

---

## 3. One mock section is enough for now

We decided to use:

- **one hardcoded mock P1 section**

instead of multiple variants.

That kept the scope tight while still validating the full flow.

---

## 4. Explanations are core product value

You emphasized that the mock and later model-generated content should include **why** the correct answer is right.

So the answer key / results structure was designed to include:

- correct answer
- `why_correct`
- `why_others_wrong`

This is important because it shaped both backend storage and the results screen.

---

## 5. Backend model source of truth should follow your architecture doc

You pasted the domain model from `architecture-design.md`, and we decided to use that as the backend source of truth.

Main entities discussed:

- `Exam`
- `ExamSection`
- `SectionAttempt`
- `WritingSubmission` (later)
- `ReviewItem` (later)

For this slice, we implemented the first three.

---

## 6. `selected_parts` belongs on `Exam`

Even though `selected_parts` wasn’t originally listed in the model section of the architecture doc, it appeared in the endpoint contract, so we agreed it should be persisted on `Exam`.

That became part of the implemented model.

---

## 7. Section rows should be pre-created on exam creation

We kept the earlier architectural decision that:

- when an exam is created
- all selected sections are pre-created as `ExamSection` rows
- with initial status `pending`

That means generation is a separate step from creation.

---

## 8. Canonical part ordering should be enforced

We decided that part ordering should always be normalized to:

- `P1` to `P8`
- then `W1`, `W2`

even if the user sends a weird order.

This was implemented in the backend constants/helpers.

---

## 9. Unique constraint on `(exam, part_code)`

We decided each exam should only have one section row per part.

That became a model constraint.

---

## 10. First frontend exam UI should be date-based, not UUID-based

Later in the conversation, after seeing the UI, you noted that:

- `Exam <uuid>` looks bad

We agreed it should instead be a friendlier computed name, like:

- `P1 Practice · Mar 22, 2026`

This was implemented in the frontend via a helper, not as a backend DB field.

---

## 11. P1 should be rendered inline, not as separate question cards

After trying the first P1 UI, you gave an important UX insight:

- scrolling down to see answer options and back up to the text is annoying

So we redesigned P1 into an **inline cloze renderer**, where each gap appears inside the passage as a dropdown.

That was a major product/UI improvement and likely the correct long-term approach for Part 1.

---

## 12. Inline gaps should use explicit `segments`

To support inline rendering properly, we decided the P1 content structure should move from:

- one large passage string

to:

- `segments`
  - text segments
  - gap segments

This makes the frontend much simpler and is a better contract for future AI generation too.

---

## 13. No need for backward compatibility right now

When we discussed updating the mock shape from `passage` to `segments`, I initially suggested optional backward compatibility.

You decided that was unnecessary at this stage, which was a good call.

We chose to:

- delete old exams
- move forward cleanly with `segments`
- regenerate fresh data

---

## 14. Frontend feature folder naming should be revisited later

At the end, you noticed that having:

- `src/features/p1/`

may not scale well if every section gets its own top-level feature folder.

I agree with your instinct.

### My recommendation for later

Once more parts are added, the structure should probably evolve to something like:

```txt
src/features/sections/
  p1/
  p2/
  p3/
  ...
  p8/
  w1/
  w2/
```

or possibly:

```txt
src/features/exams/sections/
  p1/
  p2/
  ...
```

### My opinion

Yes, it is fine **for now** to keep `src/features/p1/`, because only one section exists and it keeps the initial slice simple.

But once you add more parts, I do think you should refactor toward something like:

- `src/features/sections/p1/`

That will scale better and avoid cluttering top-level `features/`.

So yes: **future refactor, not urgent now**.

---

# What we implemented on the backend

## 1. Created `apps/exams`

You had already created the Django app:

- `apps/exams`

We used that as the home for the new domain slice.

---

## 2. Added backend file structure

We planned and implemented files in `apps/exams/`, including:

- `constants.py`
- `models.py`
- `admin.py`
- `mock_generators.py`
- `services.py`
- `serializers.py`
- `views.py`
- `urls.py`
- tests folder with API/model tests

---

## 3. Implemented `constants.py`

We created central domain constants for:

- part codes (`P1` ... `P8`, `W1`, `W2`)
- canonical ordering
- section types
- exam statuses
- section statuses
- generation modes
- difficulty levels

We also added helper functions:

- `sort_parts(...)`
- `infer_section_type(...)`

This made model/business logic cleaner and more future-proof.

---

## 4. Implemented backend models

### `Exam`

Implemented with fields like:

- `id`
- `user`
- `mode`
- `difficulty`
- `timer_enabled`
- `ruoe_timer_minutes`
- `writing_timer_minutes`
- `uk_spelling`
- `status`
- `selected_parts`
- timestamps

### `ExamSection`

Implemented with fields like:

- `id`
- `exam`
- `part_code`
- `section_type`
- `status`
- `generator_version`
- `content_json`
- `answer_key_json`
- `raw_model_output`
- `prompt_log_json`
- timestamps

Plus uniqueness constraint:

- `(exam, part_code)`

### `SectionAttempt`

Implemented with fields like:

- `id`
- `section`
- `user`
- `started_at`
- `submitted_at`
- `time_spent_seconds`
- `answers_json`
- `score`
- `max_score`
- `results_json`

---

## 5. Registered models in Django admin

We added admin registrations so you can inspect:

- exams
- sections
- attempts

This is useful while iterating.

---

## 6. Implemented service-layer business logic

In `services.py`, we implemented logic for:

- validating selected parts
- creating exams
- pre-creating section rows
- generating a section for an exam
- submitting and grading objective sections

This kept business logic out of views.

---

## 7. Implemented mock generation for P1

We first implemented a hardcoded mock that had:

- content
- questions
- options
- answer key
- explanations

Later, we improved it significantly.

### First improvement

We replaced the too-short placeholder text with a **full 8-gap P1 mock text**.

### Second improvement

We changed the content structure to use:

- `segments`
- `questions`

instead of only a single passage string.

This made inline rendering possible.

---

## 8. Implemented serializers

We created serializers for:

- exam creation input
- exam detail/list output
- section payload output
- section submission input
- attempt-related output

This gave the frontend a clean API contract.

---

## 9. Implemented backend endpoints

We implemented these main endpoints:

### Exam endpoints

- `POST /api/exams/`
- `GET /api/exams/`
- `GET /api/exams/{exam_id}/`

### Section generation / retrieval

- `POST /api/exams/{exam_id}/sections/{part_code}/generate`
- `GET /api/exams/{exam_id}/sections/{part_code}/`

### Submission

- `POST /api/sections/{section_id}/submit`

All of them are auth-protected.

---

## 10. Added URL routing

We created `apps/exams/urls.py` and included it into the main Django URL configuration under `/api/`.

---

## 11. Ran migrations in Docker

You ran:

- `docker compose exec backend python manage.py makemigrations`
- `docker compose exec backend python manage.py migrate`

So the models are fully persisted in the database.

---

# What we implemented in tests

## 1. Added pytest guidance

We discussed how tests and coverage should work in a Dockerized setup.

Important conclusion:

- local `pytest` install on your machine does not affect the container
- tests should run inside the backend container
- pytest dependencies should exist in the backend container environment

---

## 2. Added backend tests

We created tests for:

### `test_models.py`

To cover:

- storing selected parts
- part sorting/deduplication
- section type inference
- uniqueness constraint

### `test_api_create_exam.py`

To cover:

- authenticated user can create an exam
- section shell is pre-created
- selected parts are normalized

### `test_api_generate_p1.py`

To cover:

- generate endpoint fills content and answer key
- section moves to `ready`

### `test_api_submit_section.py`

To cover:

- submission scores correctly
- attempt is created
- explanations are returned

---

## 3. All tests passed

You ran the tests and confirmed:

- **all tests passed**

This is a strong checkpoint because it means the backend slice is not only implemented, but validated.

---

# What we implemented on the frontend

## 1. Confirmed existing frontend state before coding

Before writing frontend code, I checked that your frontend already had:

- `react-router-dom`
- `features/auth`
- `components/ui`
- `lib/api.ts`
- Tailwind/shadcn setup
- `.dark` class support

So we built on top of that rather than replacing it.

---

## 2. Added frontend structure

We expanded the frontend with more organized feature/layout files, including:

### Layout

- `components/layout/AppShell.tsx`
- `TopNav.tsx`
- `ThemeToggle.tsx`
- `PageContainer.tsx`

### Shared components

- `LoadingSpinner.tsx`
- `EmptyState.tsx`
- `ErrorState.tsx`
- `SectionStatusBadge.tsx`

### Exams feature

- API wrappers
- types
- create form
- exam header
- section tabs

### P1 feature

- first version used `P1Passage.tsx` + `P1QuestionCard.tsx`
- later switched to `P1InlineRenderer.tsx`

### Pages

- `DashboardPage.tsx`
- `CreateExamPage.tsx`
- `ExamDetailPage.tsx`
- `ExamSectionPage.tsx`
- `SectionResultsPage.tsx`

---

## 3. Added app shell and routing

We replaced the minimal app shell with a real protected app flow using:

- `AppShell`
- `TopNav`
- nested protected routes
- dedicated pages for the exam flow

This made the app feel like a real product.

---

## 4. Added navbar and dark mode

We added:

- top navigation
- links to Dashboard and New Exam
- logout button
- theme toggle

This fulfilled your request for a polished UX from the start.

---

## 5. Added mobile-first layout

All new pages/components were written to be mobile-first.

Examples:

- responsive layout containers
- stacked UI on smaller screens
- horizontal section tabs that can scroll
- sticky bottom submit panel on the section page

---

## 6. Added frontend API layer

We created frontend API wrappers for:

- create exam
- get exam
- list exams
- generate section
- get section
- submit section

That kept page components cleaner.

---

## 7. Implemented create exam flow

We added a `CreateExamPage` + `CreateExamForm` that lets the user:

- create a new exam
- currently only with `P1`
- choose mode/difficulty/timer/UK spelling

This then navigates to the exam detail page.

---

## 8. Implemented dashboard

We upgraded the dashboard to show:

- greeting
- CTA to start a new exam
- recent exams list
- section statuses

This made the app feel much more complete.

---

## 9. Implemented exam detail page

We added a page that shows:

- exam header
- exam settings badges
- section status cards
- section navigation
- generate/open actions for sections

For now this is focused on `P1`.

---

## 10. Implemented section runner page

The first version of the section page used:

- passage card
- separate question cards below

This worked technically, but created a UX issue.

---

## 11. Redesigned P1 to inline dropdown gaps

After your feedback, we completely redesigned the P1 runner.

Now the section page renders:

- the passage inline
- each gap as a dropdown inside the text
- selected value shown inside the blank
- answered count shown below
- sticky submit bar at the bottom

This was a major UX improvement.

---

## 12. Used shadcn `Select` for inline gaps

You specifically requested:

- not the browser’s plain select
- a nicer shadcn dropdown

We implemented the inline gaps using the shadcn `Select` component.

This now looks much more like a polished product UI.

---

## 13. Implemented results page

After submitting, the user sees:

- score
- max score
- per-question explanations
- why correct
- why the others do not fit

This matches the backend results structure and the original product goal.

---

## 14. Added exam title helper

To avoid ugly titles like `Exam 8ee6412e`, we added:

## `src/lib/exam.ts`

with a helper to format exam titles like:

- `P1 Practice · Mar 22, 2026`

This was then used in:

- `ExamHeader.tsx`
- `DashboardPage.tsx`

This was a nice UX refinement.

---

## 15. Fixed dark mode contrast in inline dropdown selection

After testing the inline P1 renderer, you noticed:

- in dark mode the selected inline dropdown looked too low-contrast

We fixed that by changing the selected state from an inverted foreground/background style to a more theme-safe highlighted style using:

- `bg-accent`
- `border-primary/40`
- `text-foreground`

That made the selected gaps clearly visible in dark mode.

You confirmed:

- **it works perfectly now**

---

# Docker / development commands we used or discussed

## Backend management commands

### Enter Django shell

```bash
docker compose exec backend python manage.py shell
```

### Make migrations

```bash
docker compose exec backend python manage.py makemigrations
```

### Migrate

```bash
docker compose exec backend python manage.py migrate
```

### Delete all exams from shell

```python
from apps.exams.models import Exam
Exam.objects.all().delete()
exit()
```

### Delete a specific exam from shell

```python
from apps.exams.models import Exam
exam = Exam.objects.get(id="PUT_FULL_UUID_HERE")
exam.delete()
exit()
```

---

## Backend test commands

### Run exams tests

```bash
docker compose exec backend pytest apps/exams/tests
```

### Run exams tests with coverage

```bash
docker compose exec backend pytest apps/exams/tests --cov=apps.exams --cov-report=term-missing
```

### Run exams tests with HTML coverage

```bash
docker compose exec backend pytest apps/exams/tests --cov=apps.exams --cov-report=html
```

---

## Rebuild / restart backend

### Restart backend after code changes

```bash
docker compose restart backend
```

### Rebuild backend image if needed

```bash
docker compose build backend
docker compose up -d
```

### Rebuild only backend service if needed

```bash
docker compose up -d --build backend
```

---

## Frontend commands

### Restart frontend if hot reload does not pick up changes

```bash
docker compose restart frontend
```

### Run frontend dev command inside container

```bash
docker compose exec frontend npm run dev
```

---

## Test tooling commands discussed earlier

These were discussed conceptually for local/non-container use too, but in your project the containerized versions are the important ones.

---

# Important UX / design learnings from this conversation

## 1. Inline answers are much better for Part 1

This was one of the best discoveries in the conversation.

The first implementation was correct technically, but the inline dropdown approach is clearly better for P1.

This likely sets the direction for the final app’s Part 1 UI.

---

## 2. Product polish matters early

Building the app shell, dark mode, navigation, and mobile-first layout early was the right choice.

It made the project feel real immediately and surfaced useful UX feedback much earlier.

---

## 3. The backend JSON contract should support the UI directly

Switching to explicit `segments` for P1 is a great architectural move.

It means future model-generated content should target a UI-friendly structure rather than forcing the frontend to parse raw text.

---

# Files / areas that changed conceptually

## Backend

- `apps/exams/constants.py`
- `apps/exams/models.py`
- `apps/exams/admin.py`
- `apps/exams/mock_generators.py`
- `apps/exams/services.py`
- `apps/exams/serializers.py`
- `apps/exams/views.py`
- `apps/exams/urls.py`
- `apps/exams/tests/...`

## Frontend

- `src/App.tsx`
- `src/main.tsx`
- `src/lib/exam.ts`
- `src/components/layout/...`
- `src/components/shared/...`
- `src/features/exams/...`
- `src/features/p1/...`
- `src/pages/DashboardPage.tsx`
- `src/pages/CreateExamPage.tsx`
- `src/pages/ExamDetailPage.tsx`
- `src/pages/ExamSectionPage.tsx`
- `src/pages/SectionResultsPage.tsx`

---

# Current state at the end of the conversation

At the end of this conversation, the app now supports this end-to-end flow:

1. user logs in
2. user opens dashboard
3. user creates a new exam with `P1`
4. backend creates exam + section shell
5. user generates `P1`
6. backend stores full mock P1 content with inline `segments`
7. frontend renders P1 inline with shadcn dropdown gaps
8. user answers inside the passage
9. user submits the section
10. backend scores the section using stored answer key
11. frontend shows detailed results with explanations

That means your **first real vertical slice is working**.

And it is not just “functional” — it is already polished enough to validate UX and architectural decisions.

---

# Suggested next steps

## Immediate next steps

The next best steps would be:

### 1. Clean up frontend structure naming before it spreads too much

Not urgent, but once you add a second or third section, consider refactoring:

From:

```txt
src/features/p1/
```

Toward:

```txt
src/features/sections/p1/
```

or:

```txt
src/features/exams/sections/p1/
```

I would wait until at least one more section is added, then do the refactor once.

---

### 2. Add P2 next

The most natural next product slice is likely:

- `P2`

because it continues the Reading and Use of English flow and can reuse much of the same architecture:

- create/generate/fetch/submit/results

---

### 3. Generalize section rendering

As you add more sections, start thinking about:

- a section registry
- part-specific renderer mapping
- shared section shell components

For example:

- `P1Renderer`
- `P2Renderer`
- `P3Renderer`
- etc.

---

### 4. Decide future frontend folder convention

Before too many parts are added, lock in the scalable naming convention for section features.

I would currently lean toward:

```txt
src/features/sections/
  p1/
  p2/
  ...
  w1/
  w2/
```

because it’s explicit and future-proof.

---

### 5. Add ability to list/open completed attempts more robustly

Right now the results page depends on navigation state.

Eventually you will probably want:

- attempts fetched from backend
- results page loadable directly by URL

But this is not urgent for the current slice.

---

### 6. Add Anthropic only after another section or after contract stabilization

Now that the mock contract is shaping up, you’ll want to decide when to replace mock generation with real generation.

My recommendation:

- either add one more section first
- or at least stabilize the content contract per part before plugging in Anthropic

---

## Broader roadmap after this

A sensible roadmap from here could be:

1. P2 vertical slice
2. section-folder refactor
3. P3/P4 objective slices
4. shared section rendering patterns
5. results persistence / direct loading
6. Anthropic generation
7. writing slices W1/W2
8. review queue / spaced repetition
9. stats dashboards

---

# Final takeaway

This conversation moved the project from:

- auth-only skeleton

to:

- a real, working, polished exam product slice

Specifically, you now have:

- backend domain models
- endpoints
- services
- tests
- mock generation
- frontend app shell
- exam flow
- inline P1 UX
- results + explanations
- dark mode polish
- improved naming

This was a **big milestone** and a very good one to document.
