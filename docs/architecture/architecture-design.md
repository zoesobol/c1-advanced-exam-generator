# Cambridge C1 Advanced Practice Webapp — Full Project Context Summary

## Project goal

The goal is to build a **webapp for practising Cambridge C1 Advanced (CAE)** exam tasks, using the **Claude API** to generate realistic exercises and feedback.

The app is focused on:

- **Reading and Use of English**
- **Writing**

It will **not** include:

- Listening
- Speaking

That is intentional, because listening and speaking are already being practised elsewhere, and they are not a good fit for this app format.

---

# Exam familiarity and validity of the original idea

We confirmed that the proposed idea is plausible because the Cambridge C1 Advanced exam structure is well-defined and can be mapped to interactive tasks in a webapp.

The exam structure discussed was:

## Reading & Use of English — 8 parts

1. Multiple-choice cloze
2. Open cloze
3. Word formation
4. Key word transformation
5. Multiple choice reading
6. Cross-text multiple matching
7. Gapped text
8. Multiple matching

This totals **56 questions**, which matches the real CAE structure.

## Writing — 2 parts

- **Part 1:** compulsory essay
- **Part 2:** choose 1 of 3 prompts, usually among genres like report, review, proposal, email/letter

We decided the app should support all of the Reading and Use of English parts and the Writing paper.

---

# Product requirements decided

## Scope of generation

At first, the app should only generate:

- Reading and Use of English tasks
- Writing tasks

It should **not** support listening or speaking.

## Explanations and corrections

- For **Reading and Use of English**, the app must provide **explanations after answering**
- For **Writing**, the app must provide **detailed corrections**

---

# User preferences and functional decisions

## Generation granularity

The app should let the user choose **which parts to generate**.

This should be done in the UI using something like **checkboxes**, so the user can generate:

- a full paper
- or only specific parts

This is important both for flexibility and for token cost control.

## Cambridge accuracy

All generated tasks must always use:

- **Cambridge-accurate task formats**
- **Cambridge-accurate question counts**

No flexible or approximate counts. The structure must match the real exam.

## Timer

The app should support:

- **timed mode**
- **untimed mode**

The user must be able to choose this in the UI.

### Timer rules decided

For Reading and Use of English:

- use **one combined timer**, because that is more exam-like

For Writing:

- have its own writing timing context if needed, but the main important decision was that RUoE should use a single combined timer rather than per-part timers

---

# Topic and content constraints

## Topic handling

We discussed whether the app should avoid topics like politics, violence, religion, etc.

The conclusion was:

- Cambridge does not publicly provide a neat “forbidden topics” list
- their tasks tend to use **broad, non-specialist, general adult-safe topics**
- even when topics are somewhat sensitive, they are handled in a **neutral, non-inflammatory** way

So instead of trying to guess what is “banned,” the app should implement:

## Topic whitelist

The generator should use a **Cambridge-safe topic whitelist**, including themes like:

- education
- technology
- environment
- work
- culture
- science
- psychology
- travel
- communication
- urban life
- media
- lifestyle
- consumer habits

## Safety filter

Prompting should instruct the model to avoid:

- graphic violence
- explicit sexual content
- hate
- self-harm
- inflammatory or extreme treatment of sensitive themes

If a sensitive issue is touched on, it should remain:

- neutral
- non-graphic
- suitable for a general exam audience

---

# Language preferences

## Spelling

The app should **enforce UK spelling** throughout:

- generated tasks
- answer keys
- rewrites
- writing feedback

This is true even though the user personally speaks American English. Since this is Cambridge, British spelling should be used consistently.

---

# Explanation depth

## Reading and Use of English explanation style

The user wanted explanations, but preferred something not too token-expensive.

Decision:

- use **medium-detail explanations**

That means explanations should be enough to understand the answer, but not absurdly verbose.

### Additional explanation rule

For multiple-choice tasks, it is desirable to explain:

- why the correct answer is correct
- why the distractors are wrong

This was explicitly approved.

---

# Part 4: Key word transformation handling

We discussed that in CAE Part 4, multiple correct answers are common.

Decision:

- the app **must support multiple accepted correct answers**
- it must not rely on only one canonical answer

This affects both:

- backend answer storage
- grading logic

Part 4 should also enforce:

- the keyword must be used
- the keyword must remain unchanged
- the word limit must be respected

---

# Writing feedback requirements

The user wanted writing correction to be rich and useful.

Decision:
Writing feedback must include **all three**:

1. **Inline edits** / diff-like corrections
2. **Annotated comments** (paragraph- or sentence-level)
3. **A clean rewritten version**

Additionally, the app should include:

## Cambridge-style rubric scoring

The writing response should be graded using Cambridge-like criteria:

- Content
- Communicative Achievement
- Organisation
- Language

And also include an overall summary / overall score impression.

## Word count support

The app should:

- display the **live word count while writing**
- warn about under/over target range

## Planning help

The app should have a **toggle** so the user can choose whether they want planning help before writing.

Planning help is optional, not forced.

---

# Auth and usage assumptions

## Auth requirement

The app should include **authentication**, because even though it will run locally on siwka’s server, it will still spend tokens, so it should not be open-access.

Decision:

- use **JWT authentication**

---

# Stats, tracking, and saved attempts

The user explicitly wanted stats and progress tracking.

The app should support:

- saving attempts
- tracking scores over time
- performance by part
- review of past tests

The user specifically likes seeing things like:

- “8/8”
- clear score breakdowns
- accuracy trends

---

# Review mode and spaced repetition

This was discussed and strongly liked.

Decision:
The app should support:

- **review mode**
- **spaced repetition**
- an **error book / mistake queue**

Important conclusion:

- this does **not** need to use tokens
- it can be implemented by storing questions, correct answers, and mistake history in the database

So review mode can be powered entirely by:

- stored generated tasks
- stored answer keys
- stored explanations
- user performance history

No model call needed for reattempting past mistakes.

---

# Hinting

We discussed whether the app should provide hints during questions.

Decision:

- **skip hints for v1**

Reason:

- the real exam does not provide hints
- it is better to keep practice closer to exam conditions

Possible later idea:

- post-fail hints or clue mode could be considered in a future version

---

# Generation strategy and cost considerations

## Generate part-by-part

We discussed whether to generate a whole paper at once or section-by-section.

Decision:

- generate **part-by-part**

Reasons:

- cheaper
- easier to regenerate one part
- more flexible when user selects only certain parts
- better error recovery

## Regenerate one section

Decision:

- the app must support **regenerating just one part**
- it should not require regenerating the whole exam

## Difficulty

The app should support difficulty selection within the C1 band, such as:

- easier C1
- medium C1
- harder C1

This was accepted as a useful feature.

## Budget vs quality mode

The app should have a toggle for:

- **Budget mode**
- **Quality mode**

This gives the user control over token usage.

Default expectation:

- quality mode is the normal preferred mode
- budget mode is useful when trying to save tokens

---

# Streaming discussion

We discussed streaming responses.

Explanation given:

- streaming means the model output arrives in chunks as it is generated

The user liked the idea only if it did not reduce reliability.

Conclusion:

- streaming does **not** reduce model quality
- but it adds engineering complexity, especially with structured JSON

Final decision:

- **do not use streaming in v1**
- instead, use:
  - loading states
  - spinners
  - “Generating…” UI indicators

This is simpler and more robust, especially because many outputs must be valid structured JSON.

---

# Prompt and output storage

Decision:
The app should store:

- full prompts
- model configuration
- raw model outputs
- parsed structured outputs

Reasons:

- debugging
- auditability
- redoing tests later
- understanding what went wrong when generation is off

---

# Data format decisions

## Reading and Use of English

For Reading and Use of English, model output should be:

- **strict structured JSON**

This allows:

- deterministic grading
- reliable frontend rendering
- schema validation
- regeneration when invalid

## Writing

For writing, grading and feedback must still be model-generated, but the response should still be returned as:

- **structured JSON**

This lets the frontend render:

- rubric scores
- inline edits
- paragraph comments
- rewritten version
  cleanly and predictably

---

# Tech stack

## Backend

- Django
- Django REST Framework (DRF)
- JWT authentication
- Postgres

This was chosen because the user is familiar with DRF APIs and Postgres is acceptable.

## Frontend

- React
- TypeScript
- Tailwind CSS
- shadcn/ui

This matches the user’s preferred frontend stack.

---

# Infrastructure and deployment decisions

## Existing VM

The user already has a VM with another project (Mood Tracker) and Postgres installed.

Question raised:

- should the existing project be deleted and replaced?
- or should both coexist?

Conclusion:

- **do not delete the Mood Tracker**
- both apps can coexist on the same VM

## Recommended deployment approach

Use:

- the same VM
- nginx as reverse proxy
- separate subdomains

For example:

- `mood.yourdomain.com` → existing Mood Tracker
- `english.yourdomain.com` → new Cambridge app

This is fully feasible.

## Postgres

Use the same Postgres server, but with:

- separate databases
- optionally separate users/roles

For example:

- `mood_db`
- `english_db`

This keeps the projects cleanly separated.

## nginx

nginx should route traffic by host/subdomain.

## Docker

It was noted that using Docker Compose would make this setup even cleaner, though exact deployment tooling was not locked as a hard requirement.

---

# High-level domain model

We defined these main backend entities:

## `Exam`

Represents a generated session.

Suggested fields:

- `id`
- `user_id`
- `mode` → `budget | quality`
- `difficulty` → `c1_low | c1_mid | c1_high`
- `timer_enabled`
- `ruoe_timer_minutes`
- `writing_timer_minutes`
- `uk_spelling`
- `status` → `draft | generating | ready | in_progress | completed`
- `created_at`
- `updated_at`

## `ExamSection`

Represents one generated part.

Suggested fields:

- `id`
- `exam_id`
- `part_code`
- `section_type` → `ruoe | writing`
- `status` → `pending | generating | ready | failed`
- `generator_version`
- `content_json`
- `answer_key_json`
- `raw_model_output`
- `prompt_log_json`
- `created_at`
- `updated_at`

## `SectionAttempt`

Represents a user’s submission for one objective section.

Suggested fields:

- `id`
- `section_id`
- `user_id`
- `started_at`
- `submitted_at`
- `time_spent_seconds`
- `answers_json`
- `score`
- `max_score`
- `results_json`

## `WritingSubmission`

Represents a writing submission and its rich feedback.

Suggested fields:

- `id`
- `section_id`
- `user_id`
- `text`
- `word_count`
- `submitted_at`
- `feedback_json`
- `score_json`
- `raw_model_output`
- `prompt_log_json`

## `ReviewItem`

Represents a stored mistake / spaced repetition item.

Suggested fields:

- `id`
- `user_id`
- `source_section_id`
- `source_question_id`
- `part_code`
- `prompt_snapshot_json`
- `correct_answer_json`
- `explanation_json`
- `times_seen`
- `times_correct`
- `last_reviewed_at`
- `next_review_at`
- `ease_factor`
- `interval_days`
- `status` → `active | mastered | suspended`

---

# Endpoint architecture

The API was grouped into:

- auth
- exam creation/generation
- submissions
- stats
- review

---

## Auth endpoints

### `POST /api/auth/register`

Create account.

### `POST /api/auth/login`

Return JWT access and refresh tokens.

### `POST /api/auth/refresh`

Refresh JWT.

### `GET /api/auth/me`

Return current user info.

---

## Exam creation and generation endpoints

### `POST /api/exams/`

Create a new exam session.

Request example:

```json
{
  "selected_parts": ["P1", "P2", "P3", "P4", "P7", "W1", "W2"],
  "mode": "quality",
  "difficulty": "c1_mid",
  "timer_enabled": true,
  "planning_help_enabled": false,
  "uk_spelling": true
}
```

Response example:

```json
{
  "id": "exam_123",
  "status": "draft",
  "selected_parts": ["P1", "P2", "P3", "P4", "P7", "W1", "W2"],
  "timer_enabled": true,
  "ruoe_timer_minutes": 90,
  "writing_timer_minutes": 90
}
```

### `POST /api/exams/{exam_id}/generate`

Generate all selected sections part-by-part.

### `POST /api/exams/{exam_id}/sections/{part_code}/generate`

Generate or regenerate one section only.

### `GET /api/exams/{exam_id}`

Return exam metadata plus section statuses.

### `GET /api/exams/{exam_id}/sections/{part_code}`

Return one section payload for rendering.

### `GET /api/exams/`

List user exams with filters.

Possible filters:

- status
- date
- type
- score presence

---

## Objective section submission endpoint

### `POST /api/sections/{section_id}/submit`

Submit answers for one Reading / Use of English section.

Request example:

```json
{
  "answers": {
    "q1": "B",
    "q2": "A",
    "q3": "D"
  },
  "time_spent_seconds": 532
}
```

Response example:

```json
{
  "section_id": "sec_123",
  "score": 6,
  "max_score": 8,
  "results": [
    {
      "question_id": "q1",
      "user_answer": "B",
      "correct": true,
      "correct_answers": ["B"],
      "explanation": {
        "why_correct": "This collocation is the natural one in context.",
        "why_others_wrong": {
          "A": "Wrong preposition pattern.",
          "C": "Meaning does not fit.",
          "D": "Unnatural collocation."
        }
      }
    }
  ]
}
```

---

## Writing submission endpoint

### `POST /api/writing/sections/{section_id}/submit`

Submit writing and trigger evaluation.

Request example:

```json
{
  "text": "Your essay text here...",
  "time_spent_seconds": 2480
}
```

Response example:

```json
{
  "section_id": "sec_w1",
  "word_count": 237,
  "score": {
    "content": 4,
    "communicative_achievement": 4,
    "organisation": 3,
    "language": 4,
    "overall": 4
  },
  "feedback": {
    "summary": "A strong response with clear ideas, though cohesion and paragraph linking could be improved.",
    "word_count_status": "within_range",
    "inline_edits": [],
    "paragraph_comments": [],
    "sentence_comments": [],
    "rewritten_version": "..."
  }
}
```

---

## Stats endpoints

### `GET /api/stats/overview`

Should return:

- total attempts
- average score by part
- recent trend
- common error types
- writing band averages

### `GET /api/stats/parts/{part_code}`

Detailed performance for a specific part.

### `GET /api/stats/writing`

Writing-focused analytics:

- average rubric scores
- recurring issues
- word count trends

---

## Review endpoints

### `GET /api/review/queue`

Return due review items.

### `POST /api/review/{review_item_id}/submit`

Submit review answer.

### `POST /api/review/{review_item_id}/skip`

Skip or snooze an item.

### `GET /api/review/stats`

Return review-related stats:

- streaks
- due count
- mastered count

---

# Section schema strategy

We established an important architecture rule:

Every generated section should have:

- a **common wrapper**
- a **part-specific payload**

Also, we strongly recommended:

- using **part-specific serializers / schemas**
- not trying to force every part into one mega generic cursed monster schema 😭

Example idea:

- `P1SectionSerializer`
- `P2SectionSerializer`
- ...
- `WritingPart1Serializer`
- `WritingPart2Serializer`

---

# Common wrapper schema

Every section should include fields like:

```json
{
  "section_id": "sec_123",
  "part_code": "P1",
  "section_type": "ruoe",
  "title": "Reading and Use of English - Part 1",
  "instructions": "For questions 1–8, read the text below and decide which answer best fits each gap.",
  "topic": "workplace psychology",
  "difficulty": "c1_mid",
  "uk_spelling": true,
  "content": {},
  "answer_key": {},
  "meta": {
    "estimated_minutes": 12,
    "generator_version": "v1"
  }
}
```

---

# Detailed per-part content schemas

## Part 1 — Multiple-choice cloze

- passage rendered as segments with gap placeholders
- questions array with options A–D
- answer key with one correct answer per gap
- explanation includes:
  - why correct is correct
  - why each distractor is wrong

We specifically liked using `passage_segments` rather than raw HTML so the frontend can render gaps cleanly.

---

## Part 2 — Open cloze

- passage segments with inline gaps
- one-word answer expected
- answer key with accepted answer(s)
- explanation includes grammar or structure focus

---

## Part 3 — Word formation

- passage segments with inline gaps
- each gap includes a base word
- answer key includes correct derived form
- explanation includes word formation focus, e.g. noun suffix, adjective formation, negative prefix, etc.

---

## Part 4 — Key word transformation

Must include for each item:

- lead-in sentence
- keyword
- transformed sentence with blank
- max word count
- rules that keyword must be used and unchanged

Answer key must support:

- multiple accepted answers
- normalization rules:
  - case-insensitive
  - trim whitespace
  - collapse multiple spaces

Explanation should include:

- grammar principle
- common pitfalls

---

## Part 5 — Reading multiple choice

Must include:

- title
- passage paragraphs
- multiple-choice questions with A–D options

Explanations should include:

- why correct answer matches the text
- why other options are wrong
- supporting evidence reference when useful

---

## Part 6 — Cross-text multiple matching

Must include:

- texts A–D
- statements/questions
- answer key with explanation of shared attitude or contrast

---

## Part 7 — Gapped text

Must include:

- passage blocks with visible gap placeholders
- 7 paragraph options
- answer key for each gap
- explanation focusing on:
  - cohesion
  - reference chains
  - contrast/addition
  - topic continuity

---

## Part 8 — Multiple matching

Must include:

- several short texts
- several statements/questions
- answer key with short evidence-based explanation

---

## Writing Part 1 — Essay

Must include:

- task type = essay
- task prompt
- notes / bullet points
- instruction to discuss two points and say which is more important
- word range: 220–260
- optional planning help

If planning help is enabled, include:

- suggested structure
- idea prompts

---

## Writing Part 2 — Choice of 3 prompts

Must include:

- instruction to answer one of the questions
- word range: 220–260
- exactly **3 prompts**
- each prompt includes:
  - prompt id
  - genre
  - target reader
  - task

Important decision:

- Writing Part 2 should mimic the real exam by giving **three prompts** and letting the user choose one
- not by asking the user to pre-select the genre before generation

---

# Writing feedback schema

We defined a structured writing feedback format including:

- `word_count`
- `word_count_status`
- `score`
  - content
  - communicative achievement
  - organisation
  - language
  - overall

- `summary`
- `strengths`
- `priority_improvements`
- `inline_edits`
- `paragraph_comments`
- `sentence_comments`
- `rewritten_version`

This schema was designed so the frontend can render writing feedback in separate tabs or sections instead of one giant wall of text.

---

# Prompting strategy

## For Reading and Use of English

Prompts must enforce:

- exact part type
- exact question count
- exam-like style
- original content only
- UK spelling
- strict JSON schema output
- medium-detail explanations
- plausible distractors
- no ambiguity
- self-check before finalizing

### Important backend safeguard

After model generation, backend should do:

1. JSON schema validation
2. content validation per part
3. sanity checks

Examples:

- Part 1 must have exactly 8 gaps
- Part 4 answers must fit the word limit
- Part 7 must have 6 gaps and 7 options
- Writing Part 2 must have exactly 3 prompts

If validation fails:

- regenerate automatically

## For Writing evaluation

Prompts must enforce:

- Cambridge C1 rubric
- UK spelling
- specific feedback
- no empty fluff praise
- rewritten version should preserve user meaning while improving accuracy and register
- strict JSON output

---

# Frontend page map

## `/login`

JWT auth screen

## `/dashboard`

Should show:

- create new exam
- recent exams
- stats summary
- review due cards

## `/exams/new`

Configuration page for:

- part checkboxes
- difficulty
- budget/quality toggle
- timer toggle
- planning help toggle
- generate button

## `/exams/:examId`

Exam runner

## `/exams/:examId/results`

Score and review page

## `/review`

Review queue

## `/stats`

Performance analytics

---

# Shared frontend UI components

## `SectionCard`

Used for dashboard and exam sidebar:

- part name
- status
- score if completed

## `TimerBar`

- optional
- combined RUoE timer
- sticky-friendly

## `WordCountBadge`

- live count
- visual feedback if under/within/over target range

## `LoadingPanel`

Instead of streaming:

- spinner or skeleton
- “Generating Part X…” messaging
- optional progress list

## `InstructionBox`

Readable task instructions, ideally styled nicely

---

# Part-specific frontend component map

## Part 1 / Part 5 — `MultipleChoiceSection`

Use:

- passage/question renderer
- radio-style options
- large clickable rows
- keyboard-friendly interaction

Potential subcomponents:

- `PassageRenderer`
- `MCQOptionList`

## Part 2 — `OpenClozeSection`

Use:

- inline passage
- inputs rendered inside the text

Potential subcomponents:

- `GapInput`
- `PassageWithInlineGaps`

## Part 3 — `WordFormationSection`

Same pattern as open cloze, but each gap also displays the base word.

Potential subcomponents:

- `GapInput`
- `BaseWordBadge`

## Part 4 — `KeyWordTransformationSection`

Each item should show:

- original sentence
- keyword badge
- transformed sentence with blank
- answer input
- live word count out of 6
- validation indicators such as:
  - keyword present
  - word limit okay

Potential subcomponents:

- `KeywordBadge`
- `TransformationInputCard`

## Part 6 — `CrossTextMatchingSection`

Layout:

- four text cards A–D
- statements below
- answer selector for each statement

Potential subcomponents:

- `SourceTextCard`
- `AnswerChipGroup`

## Part 7 — `GappedTextSection`

Preferred UX:

- drag-and-drop paragraphs into gaps

Layout:

- passage with drop zones
- paragraph cards below
- one extra unused paragraph remains

Potential subcomponents:

- `GapDropZone`
- `DraggableParagraphCard`

Accessibility fallback:

- dropdown selection mode

## Part 8 — `MultipleMatchingSection`

Layout:

- multiple short texts
- question statements
- answer chips A/B/C/D etc.

## Writing — `WritingEditorSection`

Layout:

- prompt panel
- writing area
- live word count
- optional planning panel
- submit button

Potential subcomponents:

- `WritingPromptCard`
- `PlanningHelpPanel`
- `WritingTextarea`
- `WordCountBadge`

---

# Results components

## `SectionScoreSummary`

Shows:

- score
- accuracy
- time spent

## `QuestionReviewCard`

For objective sections, shows:

- user answer
- correct answer
- explanation
- optionally add-to-review, though wrong answers can be auto-added

## `WritingFeedbackPanel`

Recommended tabs:

- Summary
- Rubric
- Inline edits
- Paragraph comments
- Rewritten version

This makes writing feedback much easier to consume.

---

# Stats components

## `AccuracyByPartChart`

Accuracy across:

- P1–P8
- W1/W2 if desired

## `RecentPerformanceChart`

Track scores over time

## `WeaknessTagCloud` or weakness cards

Examples:

- collocations
- articles
- linkers
- paraphrasing
- cohesion
- register

## `WritingRubricBreakdown`

Average scores by criterion:

- content
- communicative achievement
- organisation
- language

---

# Validation rules

## Objective sections

Backend should validate:

- every answer corresponds to a valid question id
- no duplicate question ids
- required count matches section
- Part 4 word-limit checks

## Writing

Backend should validate:

- text exists
- word count computed server-side
- submission stored before or regardless of final evaluation for resilience
- evaluation response matches expected feedback schema

---

# Scoring model

## Reading and Use of English

Use:

- **1 point per question**

Display scores as:

- `x / total`

Aggregate score:

- only across selected objective parts

## Writing

Show rubric separately rather than trying to fake an official Cambridge scaled score in v1.

Possible future enhancement:

- estimated CEFR/Cambridge-style interpretation, but not necessary in v1

---

# UX preferences explicitly discussed

The frontend should be **friendly and exam-like**, not a raw ugly form.

Examples explicitly wanted:

- for multiple choice, selecting an answer should feel like a proper **selectable one-answer control**, like radio/select-style interaction
- overall interaction should feel polished and comfortable

We agreed this should be built with exam-specific UI components rather than generic form dumping.

---

# Decisions about what not to do in v1

These were either ruled out or postponed:

- No listening
- No speaking
- No streaming
- No hints
- No official Cambridge scaled score conversion
- No uploaded custom text question generation yet
- No v1 need to share the app publicly
- No requirement to code immediately; the goal at this stage was to lock architecture

---

# Potential v2 / future ideas discussed or implied

## Upload your own reading text

The user mentioned this could be a **v2** feature:

- upload a text
- generate CAE-style questions from it

## Hint system

Not needed for v1, but could be explored later.

## More advanced writing analytics

Possible future additions:

- recurring grammar issue tracking
- targeted practice suggestions
- drill recommendations based on feedback patterns

## Estimated Cambridge scaled score

Could be explored later, but not recommended for v1.

## Accessibility and alternative interaction modes

For example:

- drag-and-drop fallback to dropdowns
- enhanced keyboard navigation
- maybe screen-reader-friendly task rendering

## Better planning help

Could later become:

- outline suggestions
- brainstorming prompts
- thesis suggestions
- register reminders

## Smarter review mode

Could later include:

- per-error-type review
- custom review sessions by part
- “weakest area” mode
- streaks and mastery views

## Post-fail clue mode

If hints are ever added, they should probably be:

- optional
- non-instant
- closer to clues than full help

---

# Final locked architecture summary

## Backend

- Django
- DRF
- JWT auth
- Postgres
- part-by-part generation
- structured JSON for objective sections
- structured JSON feedback for writing
- store prompts, raw outputs, parsed outputs, answers, scores, timing
- regenerate individual sections
- review mode based on DB data
- topic whitelist and safety filter
- UK spelling enforced

## Frontend

- React
- TypeScript
- Tailwind
- shadcn/ui
- polished exam-style UI
- part-specific interactive components
- one combined RUoE timer
- writing editor with word count and optional planning help
- results and analytics screens
- loading states instead of streaming

## Infra

- keep existing Mood Tracker on the VM
- use nginx with separate subdomains
- same Postgres server, separate DBs
- no need to delete existing project

---

# Best next steps from here

The next logical step after this architecture discussion would be:

## 1. Define exact request/response contracts

Write the final mini API spec for every endpoint, with exact payload examples and error responses.

## 2. Define DB schema more concretely

Turn the high-level models into actual field types and relationships.

## 3. Define JSON schemas per part

Create precise JSON schema definitions for:

- P1 through P8
- Writing Part 1
- Writing Part 2
- Writing feedback

## 4. Define prompt templates

Create:

- generation prompt templates by part
- writing evaluation prompt template
- budget vs quality variants

## 5. Define validation pipeline

Implement the generation validation and retry logic conceptually before coding:

- schema validation
- part sanity checks
- auto-regeneration on failure

## 6. Define frontend screen contract

Map each API response to UI components:

- what each page needs
- loading states
- submission flow
- results flow

## 7. Then start coding

Only after the architecture and contracts are locked.
