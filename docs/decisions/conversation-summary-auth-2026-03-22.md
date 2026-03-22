# Auth Slice Summary

## Overview

In this conversation, we implemented the first full authentication slice for the **C1 Advanced Exam Generator** and clarified the Docker workflow needed to support it cleanly during development.

This work moved the project from a scaffolded foundation into the first meaningful end-to-end vertical slice:

- backend auth endpoints
- frontend auth flow
- protected routing
- first protected page (`/dashboard`)
- secure token strategy
- clarified Docker command workflow
- verified public repo safety after pushing

This summary is intended to document both the implementation decisions and the practical development workflow established during the process.

---

## Initial alignment and project state

We began by reviewing the previously prepared architecture and conversation summary. The project direction remained fully aligned with the earlier design:

- the app is a **Cambridge C1 Advanced practice webapp**
- current scope is limited to:
  - **Reading & Use of English**
  - **Writing**

- tech stack remains:
  - **Backend:** Django, Django REST Framework, PostgreSQL, JWT
  - **Frontend:** React, TypeScript, Tailwind, shadcn/ui

- the app should be:
  - Cambridge-accurate
  - extensible
  - strict in structure
  - portfolio-quality
  - secure by default

We confirmed the implementation order for the next phase of the project:

1. authentication
2. minimal frontend auth slice
3. exam core models
4. Reading & Use of English Part 1
5. later generation/review expansion

We also confirmed the first exam part to implement after auth would be:

- **Reading & Use of English Part 1 only**

And the first protected frontend page after login would be:

- **`/dashboard`**

---

## Authentication decisions

### Credentials format

We decided that user registration and login would use:

- **email + password**

No username should be exposed in the user-facing auth flow.

### Backend security posture

We decided the backend should be:

- **authenticated by default**

Only the following should remain public:

- register
- login
- refresh
- schema
- docs
- health

Everything else should require authentication explicitly or by default permission settings.

---

## Token storage strategy

We discussed several possible auth strategies, including localStorage and full cookie-based auth.

### Final choice

We chose a hybrid approach:

- **refresh token** stored in an **HttpOnly cookie**
- **access token** returned in the response body
- frontend stores the access token **in memory only**
- **no localStorage**

### Why this approach was chosen

This approach was selected because the project will eventually run on a **local server** and be accessible over the local network.

It gave the best balance between security and implementation complexity:

- safer than storing tokens in localStorage
- simpler than full cookie-only auth for both tokens
- easier to integrate with the frontend
- suitable for a real app, not just a throwaway demo

### Resulting auth flow

The intended auth behavior became:

- login returns an access token in the response body
- login also sets a refresh token in an HttpOnly cookie
- frontend stores access token only in memory
- on page load, frontend calls refresh to restore session
- protected requests send `Authorization: Bearer <access>`
- logout clears the refresh cookie and resets client auth state

---

## HTTPS decision

We discussed whether HTTPS should be configured immediately because the future deployment target may redirect to HTTPS automatically.

### Final decision

We decided:

- **do not configure HTTPS locally right now**
- build auth to be **HTTPS-ready**
- keep local development on HTTP
- configure HTTPS later when the app is actually running on Siwka’s server

### Practical implication

The auth implementation should support a later transition to HTTPS without needing to redesign the auth flow.

That means security-sensitive settings should be environment-driven, such as:

- cookie `Secure`
- cookie `SameSite`
- allowed hosts
- trusted origins

### Development assumption

For local development:

- `AUTH_COOKIE_SECURE=False`
- `SameSite=Lax`
- localhost over HTTP is acceptable

### Future production/server assumption

Later, when the app is deployed properly:

- enable HTTPS
- set `AUTH_COOKIE_SECURE=True`
- tighten origin and host settings
- configure reverse proxy / server accordingly

---

## App organization decision

The project already had these Django apps:

- `accounts`
- `exams`
- `generation`
- `review`
- `stats`

We clarified that there was **no need** to create a separate `authentication` app.

### Final decision

Use the existing `accounts` app for auth-related logic.

That means:

- custom user model stays in `apps/accounts/models.py`
- auth serializers live in `apps/accounts/serializers.py`
- auth views live in `apps/accounts/views.py`
- auth routes live in `apps/accounts/urls.py`

This keeps auth colocated with the user model and avoids unnecessary app sprawl.

---

## Backend implementation completed

We implemented the backend authentication slice under `/api/auth/`.

### Endpoints added

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`

### Responsibilities of each endpoint

#### Register

- create a user from `email + password`
- return a serialized user payload
- do not auto-login yet

#### Login

- validate email/password
- authenticate user
- issue refresh and access tokens
- set refresh token as an HttpOnly cookie
- return access token in the response body
- return user payload

#### Refresh

- read refresh token from cookie
- validate it
- issue a fresh access token
- return access token and user payload

#### Logout

- clear the refresh token cookie

#### Me

- return the current authenticated user
- require authentication

---

## User model changes

We updated the custom `User` model so that email-based auth works cleanly without requiring a user-facing username.

### Main changes

- introduced a custom user manager
- normalized email input
- automatically set `username` from email
- set `USERNAME_FIELD = "email"`
- kept `username` on the model for compatibility with Django internals

### Reasoning

This allows the app to support a clean `email + password` experience while still remaining compatible with Django’s authentication machinery.

---

## Backend settings changes

We updated backend settings to support secure-by-default behavior and the chosen auth architecture.

### DRF defaults

We configured REST framework so that:

- the default permission is `IsAuthenticated`
- JWT auth remains the default auth mechanism for protected endpoints
- public access is granted only where explicitly allowed

### JWT configuration

We configured SimpleJWT with:

- access token lifetime
- refresh token lifetime
- bearer token auth header type
- signing key

### Cookie configuration

We introduced settings for the refresh cookie:

- `AUTH_REFRESH_COOKIE_NAME`
- `AUTH_REFRESH_COOKIE_PATH`
- `AUTH_COOKIE_SECURE`
- `AUTH_COOKIE_SAMESITE`
- `AUTH_REFRESH_COOKIE_MAX_AGE`

### CORS / CSRF configuration

We added configuration to support frontend requests with credentials:

- `CORS_ALLOWED_ORIGINS`
- `CORS_ALLOW_CREDENTIALS = True`
- `CSRF_TRUSTED_ORIGINS`

### Other reaffirmed settings

- `AUTH_USER_MODEL = "accounts.User"`
- env loading from both backend and root `.env`

---

## Backend routing changes

We kept the backend API rooted under `/api/...` and wired auth into the project URLs.

### Main routes confirmed

- `/api/health/`
- `/api/schema/`
- `/api/docs/`
- `/api/auth/...`

Later in the conversation, we clarified frontend URL style options:

### Option A

Use:

- `VITE_API_BASE_URL=http://localhost:8000`

and request paths like:

- `/api/auth/login/`

### Option B

Use:

- `VITE_API_BASE_URL=http://localhost:8000/api`

and request paths like:

- `/auth/login/`

Both are valid. The user preferred **Option B** because it felt cleaner, and decided to adjust the frontend request paths accordingly.

No backend URL changes were needed for that preference.

---

## Frontend implementation completed

We implemented the first frontend auth slice in React.

### Main frontend pieces added

- typed API client
- auth response and payload types
- auth provider/context
- protected route component
- login page
- register page
- dashboard page
- router wiring

### First protected page

The first protected route after login was set to:

- **`/dashboard`**

Even though it is currently minimal, it serves as the first authenticated landing page and validates the end-to-end auth flow.

---

## Frontend auth behavior

The implemented frontend behavior was designed as follows:

- login sends credentials to the backend
- backend returns access token and sets refresh cookie
- frontend stores access token in memory only
- app tries refresh on initial load
- if refresh succeeds, session is restored
- protected routes become accessible
- logout clears auth state and invalidates the session client-side

### Intended user experience

1. user registers
2. user logs in
3. user lands on `/dashboard`
4. user refreshes the page
5. app restores the session through `/auth/refresh/`
6. user logs out
7. user can no longer access `/dashboard`

---

## Docker workflow clarified

A major part of the conversation focused on clarifying how Docker affects management commands and frontend dependencies.

---

## Backend Docker behavior

The Django settings use:

- `DB_HOST=db`

This means:

- inside Docker, `db` resolves correctly
- on the host machine, `db` does **not** resolve

This explained why some commands behaved differently depending on where they were run.

### Makemigrations behavior

Running:

```bash
python3 manage.py makemigrations accounts
```

from the host terminal produced a warning about not being able to resolve `db`, but still created the migration.

This is expected because `makemigrations` mostly inspects models and only warns when it cannot check migration consistency against the configured DB.

### Migrate / createsuperuser behavior

Because these require actual database access, they must be run in the backend container in this setup.

### Final rule established

Use Docker for Django management commands:

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py shell
```

This is the cleanest approach because the backend container lives in the Compose network where `db` exists.

---

## Why migrations appeared to run successfully in Docker logs

The backend service in `compose.yaml` includes:

```yaml
command: sh -c "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
```

That means when the backend container starts, it automatically:

1. runs migrations
2. starts the dev server

So Docker Desktop logs showing successful migrations were expected, even if the same command failed from the host terminal.

---

## Frontend Docker dependency workflow

The frontend service uses:

```yaml
volumes:
  - ./frontend:/app
  - /app/node_modules
```

### What this means

- source code is mounted from the host into `/app`
- but `node_modules` lives in a Docker-managed volume inside the container

### Consequences

If a dependency is installed only on the host:

- local editor sees it
- host `node_modules` updates
- the running container may not use it

If a dependency is installed only inside the container:

- the running frontend app sees it
- but the local editor may still complain

### Practical conclusion

For this setup:

- install dependencies in the container if the running app needs them
- install dependencies locally if the editor needs to resolve them

### Commands discussed

Install in the running frontend container:

```bash
docker compose exec frontend npm install react-router-dom
```

Install locally for editor/TypeScript support:

```bash
cd frontend
npm install react-router-dom
```

---

## When to use `docker compose up --build`

We clarified that `--build` is **not** needed every time code changes.

### Use `docker compose up --build` when:

- a `Dockerfile` changed
- dependency manifests changed and you want the image rebuilt
- you want the image itself to reflect current dependencies

### Not necessary when:

- only normal application code changes
- you are editing mounted files through volumes

### Practical rule

During normal development:

- keep Docker running
- edit files freely
- accept temporary errors during half-finished file saves
- rebuild only when appropriate

---

## Should Docker stay running while coding?

Yes.

We clarified that Docker can remain running while code is being edited.

### Important note

Temporary errors during file creation are normal. For example, if one new file imports another file that has not been saved yet, the dev server may briefly show errors.

That does **not** mean Docker needs to be stopped.

### Final conclusion

- Docker can stay running while coding
- temporary live reload errors are expected during incomplete edits
- stopping Docker for every code change is unnecessary

---

## Command reference

Below is the consolidated command set discussed during this conversation.

### Docker lifecycle

Start services in background:

```bash
docker compose up -d
```

Start services and rebuild images:

```bash
docker compose up --build
```

Stop services without removing everything:

```bash
docker compose stop
```

Stop and remove containers/network:

```bash
docker compose down
```

Rebuild a specific image:

```bash
docker compose build frontend
```

---

### Django management commands

Local attempt that produced a DB warning:

```bash
python3 manage.py makemigrations accounts
```

Recommended Docker-based Django commands:

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py shell
```

Earlier generic commands discussed before the Docker nuance was clarified:

```bash
python manage.py makemigrations accounts
python manage.py migrate
python manage.py createsuperuser
```

---

### Frontend dependency installation

Install locally for editor / TypeScript support:

```bash
cd frontend
npm install react-router-dom
```

Install inside the running frontend container:

```bash
docker compose exec frontend npm install react-router-dom
docker compose exec frontend npm install
```

---

### Git commands

Check repo status:

```bash
git status
git status --ignored
```

Optional feature branch creation:

```bash
git checkout -b feat/auth-slice
```

Stage and commit changes:

```bash
git add .
git commit -m "Implement backend and frontend authentication flow"
```

Push to main:

```bash
git push origin main
```

---

## Files added or modified during this slice

### Backend

- `backend/apps/accounts/models.py`
- `backend/apps/accounts/serializers.py`
- `backend/apps/accounts/views.py`
- `backend/apps/accounts/urls.py`
- `backend/apps/accounts/migrations/0002_...`
- `backend/config/settings.py`
- `backend/config/urls.py`
- `backend/config/api_views.py`
- `backend/.env.example`

### Frontend

- `frontend/.env.example`
- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/src/lib/api.ts`
- `frontend/src/features/auth/...`
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/pages/RegisterPage.tsx`
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/App.tsx`
- `frontend/src/main.tsx`
- `frontend/tsconfig.app.json`
- `frontend/vite.config.ts`

---

## State of the project at the end of this conversation

By the end of this conversation, the project had gained its first meaningful auth slice.

### Backend state

- email-based custom user auth
- register/login/refresh/logout/me endpoints
- secure-by-default DRF permissions
- refresh token in HttpOnly cookie
- access token returned for in-memory frontend usage
- environment-driven auth cookie settings

### Frontend state

- auth-aware app structure started
- login page
- register page
- protected route
- dashboard page
- session restoration flow designed around refresh-on-load

### Docker workflow state

- backend management commands should be run inside Docker
- frontend dependency installation depends on whether the goal is runtime or editor support
- rebuilds are needed strategically, not constantly

---

## Next recommended step

The next slice after this auth work is:

1. verify the auth flow end to end
2. confirm login, refresh, logout, and protected dashboard all work
3. move to exam core models
4. implement exam creation flow
5. implement Reading & Use of English Part 1 generation/submission flow

This auth slice established the first real full-stack foundation the rest of the application can now build on.
