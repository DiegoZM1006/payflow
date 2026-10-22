# PayFlow — Transactions Dashboard

🌐 [Español](README.md) | **English**

[![CI](https://github.com/DiegoZM1006/payflow/actions/workflows/ci.yml/badge.svg)](https://github.com/DiegoZM1006/payflow/actions/workflows/ci.yml)

Full-stack app (Django + React) that loads PayFlow's transactions dataset, exposes it through a paginated REST API and presents it in a landing page, a dashboard and a transactions explorer for the commercial team.

**Live demo**

| | URL |
| --- | --- |
| App | https://payflow-wine-five.vercel.app |
| API docs (Swagger) | https://payflow-api-mm5l.onrender.com/api/docs/ |

> The API runs on Render's free tier: after 15 minutes without traffic it sleeps, and the first request takes ~50 s to wake it up.

## Contents

1. [Tech stack](#tech-stack)
2. [Running the project locally](#running-the-project-locally)
3. [Deployment](#deployment)
4. [API](#api)
5. [Technical decisions](#technical-decisions)
6. [Server-side vs client-side pagination](#server-side-vs-client-side-pagination)
7. [Assumptions](#assumptions)
8. [Pending work and improvements](#pending-work-and-improvements)
9. [Screenshots](#screenshots)

## Tech stack

| Layer | Technologies |
| --- | --- |
| Backend | Python 3.13, Django 5.2 LTS, Django REST Framework, django-filter, drf-spectacular, django-environ, django-cors-headers |
| Frontend | React 19, TypeScript, Vite, React Router 7, TanStack Query 5, axios, Recharts, Tailwind CSS 4, lucide-react |
| Database | SQLite for local development, PostgreSQL in Docker (17) and production |
| Quality | Django test runner (19 tests), Vitest + Testing Library (10 tests), Ruff, ESLint, Prettier, GitHub Actions |
| Infrastructure | Docker, Docker Compose, gunicorn, whitenoise, nginx, Render (API + PostgreSQL), Vercel (frontend) |

### Requirements checklist

All mandatory requirements are implemented, plus every bonus:

- [x] Docker Compose (database, backend and frontend with one command)
- [x] TypeScript
- [x] Frontend tests for the pagination component (Vitest + Testing Library)
- [x] OpenAPI documentation with Swagger UI (drf-spectacular)
- [x] Frontend request caching (TanStack Query)
- [x] CSV export of the filtered transactions
- [x] Dark mode **and** public deployment

Extras: CI on every push and pull request, linters and formatters (Ruff, ESLint, Prettier), GitHub Flow with a protected `main` branch, code splitting and accessible components.

## Running the project locally

```
payflow/
├── backend/              # Django project (config/) and the transactions app
├── frontend/             # React SPA
├── data/transactions.csv # Dataset
├── docker-compose.yml    # PostgreSQL + API + app
└── render.yaml           # Production infrastructure (Render blueprint)
```

### Option A: Docker (recommended)

Requires Docker Desktop.

```bash
docker compose up --build
```

This starts PostgreSQL, runs the migrations, loads the CSV and serves:

- App: http://localhost:8080
- API: http://localhost:8000/api/
- API docs: http://localhost:8000/api/docs/

Stop it with `docker compose down` (add `-v` to also delete the database volume).

### Option B: Manual setup

Requires Python 3.13 and Node.js 22.

**Backend** (from `backend/`):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env              # then set SECRET_KEY
python manage.py migrate
python manage.py load_transactions ../data/transactions.csv
python manage.py test
python manage.py runserver        # http://localhost:8000
```

Generate a `SECRET_KEY` with `python -c "import secrets; print(secrets.token_urlsafe(50))"`. The loader is idempotent: running it again updates rows instead of duplicating them.

**Frontend** (from `frontend/`):

```bash
npm ci
cp .env.example .env
npm test
npm run dev                       # http://localhost:5173
```

Other useful commands: `npm run lint`, `npm run format`, `npm run build`, and `ruff check .` / `ruff format .` in the backend.

### Environment variables

| Variable | Where | Description |
| --- | --- | --- |
| `SECRET_KEY` | backend | Django secret key (required) |
| `DEBUG` | backend | `True` for development; defaults to `False` |
| `ALLOWED_HOSTS` | backend | Comma-separated hostnames |
| `DATABASE_URL` | backend | Database URL; defaults to SQLite (`postgres://user:pass@host:5432/db` for PostgreSQL) |
| `CORS_ALLOWED_ORIGINS` | backend | Frontend origins allowed to call the API |
| `CSRF_TRUSTED_ORIGINS` | backend | HTTPS origins allowed to submit forms (Django admin) |
| `VITE_API_URL` | frontend | Base URL of the API (read at build time) |

## Deployment

The app deploys automatically on every merge to `main`:

| Piece | Platform | Configuration |
| --- | --- | --- |
| API + PostgreSQL | Render | [`render.yaml`](render.yaml) (Blueprint) |
| Frontend | Vercel | [`frontend/vercel.json`](frontend/vercel.json) |

To reproduce it from scratch:

1. **Render** → *New* → *Blueprint* → pick this repository. It creates `payflow-api` (Docker web service built from `backend/Dockerfile`) and `payflow-db` (PostgreSQL). `SECRET_KEY` is generated and `DATABASE_URL` is wired to the database automatically; `ALLOWED_HOSTS` and the CSRF trusted origin come from `RENDER_EXTERNAL_HOSTNAME`. On startup, the container runs the migrations and the idempotent CSV loader.
2. **Vercel** → import the repository with *Root Directory* `frontend` and the variable `VITE_API_URL=https://<service>.onrender.com/api`. Vite writes this URL into the bundle at build time, so changing it requires a redeploy.
3. **Render** → on `payflow-api`, set `CORS_ALLOWED_ORIGINS=https://<app>.vercel.app` (the exact origin, without a trailing `/`).

## API

Interactive documentation: `/api/docs/` (OpenAPI schema at `/api/schema/`).

| Endpoint | Description |
| --- | --- |
| `GET /api/transactions/` | Paginated list with filters, search and ordering |
| `GET /api/transactions/<transaction_id>/` | Transaction detail |
| `GET /api/transactions/export/` | Filtered transactions as CSV (no pagination) |
| `GET /api/metrics/summary/` | Approved amount, transactions, average ticket, approval rate, unique customers |
| `GET /api/metrics/monthly/` | Per month: approved amount, transactions, approval rate |
| `GET /api/metrics/by-category/` | Per category: approved amount, transactions, share of the approved amount |
| `GET /api/metrics/by-channel/` | Per channel: transactions and distribution by status |
| `GET /api/metrics/top-customers/` | All customers by approved amount (not paginated) |

**Query parameters for `/api/transactions/`**

| Parameter | Example |
| --- | --- |
| `page`, `page_size` (default 20, max 100) | `?page=2&page_size=50` |
| `status`, `channel`, `category`, `city` | `?status=Aprobada&city=Cali` |
| `date_from`, `date_to` (inclusive, Colombia time) | `?date_from=2025-11-01&date_to=2025-11-30` |
| `amount_min`, `amount_max` | `?amount_min=100000` |
| `search` (ID, customer name, merchant) | `?search=uber` |
| `ordering` (`created_at`, `amount`, `-` for descending) | `?ordering=-amount` |

Paginated responses include `count`, `next`, `previous`, `total_pages` and `results`. Every transaction includes two derived fields: `amount_range` (Bajo / Medio / Alto) and `weekday` (in Spanish). All metrics endpoints accept `date_from` and `date_to`.

## Technical decisions

### Data model

The CSV is a flat table that mixes three entities. Before modeling, I checked the functional dependencies in the data: each `customer_id` always has the same name, type and city, and each merchant always has the same category. The model follows **third normal form**:

- **`Customer`** (`customer_id`, name, type, city), **`Merchant`** (name, category) and **`Transaction`**, which references both. Without this, a customer's data would be repeated in every transaction and could become inconsistent (for example, one customer with two cities).
- **`Category` is not a table**: it is a fixed list of ten values without attributes of its own, so it is a `TextChoices` field on `Merchant`. Status, channel, city and customer type are also `TextChoices`.
- **Surrogate primary keys plus unique natural keys** (`transaction_id`, `customer_id`, merchant name). Foreign keys stay small integers, and the natural keys are used for the API URLs and for idempotent loading.
- **`on_delete=PROTECT`**: deleting a customer or merchant with transactions is not allowed, because financial records must be preserved.
- **Money as an integer** (`PositiveBigIntegerField`): Colombian pesos are not used with cents, integers are exact (never floats for money) and fast to aggregate.
- **Indexes** on the fields used to filter and sort (`created_at`, `amount`, `channel`, `city`, `category`) and a composite index `(status, created_at)` for the most common metrics query ("approved transactions in a date range"). Equality column first, range column second; `status` needs no index of its own because it is the composite's leftmost prefix.
- **Database check constraints**: amount greater than zero, installments between 1 and 36, and more than one installment only for credit cards (`installments = 1 OR channel = credit card`). The database is the last line of defense, whatever path the data comes from.
- **`USE_TZ` with `TIME_ZONE = "America/Bogota"`**: datetimes are stored in UTC, and monthly grouping, date filters and weekdays use Colombia time. A purchase on Oct 31 at 9 p.m. counts as October, even though it is already Nov 1 in UTC (covered by tests).

### CSV loading

`python manage.py load_transactions <path>` uses **bulk upserts** (`bulk_create(update_conflicts=True)`) on the natural keys: customers, then merchants, then transactions, inside a single atomic transaction. It runs a handful of queries instead of ~15,000 (`update_or_create` per row), it is idempotent, and if a row is invalid nothing is saved.

### API

- **Read-only viewsets**: only the endpoints the tool needs, no write operations.
- **No N+1 queries**: the list uses `select_related("customer", "merchant")`. A page of 100 results runs 2 queries (count + page) instead of 202, and a test (`assertNumQueries`) enforces it.
- **Custom page-number pagination** that adds `total_pages` (and documents it in the OpenAPI schema).
- **Filters with django-filter**: choice filters return `400` for unknown values. Date filters convert dates into timezone-aware datetime ranges instead of using `__date` lookups, so the `created_at` index can be used.
- **Stable ordering**: `-id` is always appended as a tie-breaker, so pages never repeat or skip rows when sorting by values that can tie.
- **Derived fields as model properties** (`amount_range`, `weekday`): computed on the fly, never stored, and reused by the serializer and the CSV export.
- **Metrics in a service module** (`transactions/metrics.py`), separate from the views. Aggregations run in the database with the ORM (`aggregate`, `annotate`, `TruncMonth`, conditional `Count`/`Sum` with `filter=Q(...)`), one query per endpoint. Response serializers act as the contract for the docs and the output.
- **CSV export** streams the rows (`StreamingHttpResponse` + `iterator()`) with constant memory, reuses the list filters, and adds a UTF-8 BOM so Excel shows accents correctly.

### Frontend

- **Layers**: `api/` (the only code that knows about HTTP and URLs), `hooks/` (data fetching with TanStack Query and reusable logic), `components/` (UI split by page plus shared `ui/` components), `pages/`, `types/` (TypeScript contracts that mirror the serializers), `utils/` and `constants/`.
- **TanStack Query** for server state: caching (5 min `staleTime`), loading and error states, request deduplication, and refetching when the query key (filters) changes.
- **Dashboard**: one date range state lifted to the page, which updates KPIs, the three charts and the top customers table.
- **Transactions page**: the URL is the single source of truth for page, page size, filters, search, ordering and the opened detail; URL values are validated when read. Search is debounced (400 ms), and `keepPreviousData` avoids flicker between pages. The detail uses a native `<dialog>` (focus trap, Escape and backdrop for free).
- **Formatting with `Intl`**: `$ 1.234.567` for COP and dates in Colombia time.
- **Dark mode with semantic color tokens** (`bg-surface`, `text-fg`…) defined as CSS variables, instead of duplicating every color with `dark:`. The theme follows the OS preference until the user chooses one, and an inline script prevents a white flash on load.
- **Code splitting**: the dashboard (charts) and transactions pages are lazy-loaded, so the landing page does not download Recharts.

### Quality and workflow

- **GitHub Flow**: one branch and pull request per feature, merge commits to keep the granular history, and a ruleset on `main` that requires a PR and green CI.
- **CI (GitHub Actions)** on every push and PR: Ruff, Django checks, missing migrations check, OpenAPI schema validation and backend tests; ESLint, Prettier check, TypeScript build and frontend tests.
- **Conventional Commits**.

### Infrastructure

- **Docker**: the backend image installs dependencies in a cached layer, collects static files at build time and runs as a non-root user; its entrypoint runs the migrations and the idempotent loader before gunicorn. The frontend image is a multi-stage build (Node builds, nginx serves) with an SPA fallback.
- **Production**: gunicorn instead of `runserver`, whitenoise for static files, `DEBUG=False`, PostgreSQL. `render.yaml` describes the API and the database as code (generated secret key, database URL wired automatically), and Vercel serves the frontend. Both deploy automatically on every merge to `main`.

## Server-side vs client-side pagination

| | Server-side (transactions table) | Client-side (top customers table) |
| --- | --- | --- |
| Who paginates | The backend (`LIMIT`/`OFFSET`) | The browser (`slice`) |
| What is downloaded | Only the current page | The whole list, once |
| Page, filter, search or sort change | A new request | No request: instant |
| Scales to | Any volume (millions of rows) | Hundreds or a few thousand rows |

**Server-side** is used for transactions because they are numerous and grow without limit: downloading them all would be slow and heavy, so every page, filter, search or order change asks the API for only what is shown, and `count`/`total_pages` reflect the filtered result.

**Client-side** is used for the top customers: 400 small rows are downloaded once, and searching (accent-insensitive), sorting by column and paging (10 rows per page) happen in the browser with no extra requests. It is implemented with two generic hooks (`useSort`, `useClientPagination`) and the same `Pagination` component as the server-side table.

**When to use each one:** server-side when the dataset is large, grows over time or must not be fully exposed; client-side when the list is small and bounded, and instant interactions matter more than the initial download.

## Assumptions

- **City** belongs to the customer: in the dataset each customer always has the same city. If it meant the city of each purchase, it would move to `Transaction`.
- **Number of transactions** counts every status; **average ticket** uses approved transactions only.
- **Approval rate** = approved / all transactions × 100 (pending transactions are counted in the total).
- **Unique customers**: customers with at least one transaction in the period.
- **Category share** = approved amount of the category / total approved amount.
- **Top customers**: customers with transactions in the selected period, sorted by approved amount; the "last purchase" is the last **approved** transaction.
- The global date filter of the dashboard also applies to the top customers table.

## Pending work and improvements

- **Authentication**: the API is public and read-only because no authentication was requested; in production it would sit behind the company's login (e.g. JWT or SSO).
- **Loader robustness**: validate CSV headers and choice values up front, and turn database errors into a clear `CommandError` with the offending row.
- **Validation**: reject `date_from` later than `date_to` with a `400` instead of returning an empty result.
- **More tests**: backend tests for search, ordering and `by-channel`; frontend tests for the URL state hook and the pages; end-to-end tests (Playwright).
- **Performance at scale**: cursor pagination for very large tables, caching metrics endpoints (e.g. Redis), and materialized aggregates if the data grew to millions of rows.
- **Hosting**: the free tier sleeps after inactivity and its PostgreSQL expires after 30 days; a paid tier would remove the cold start.

## Screenshots

**Landing**

![Landing page](docs/screenshots/landing.png)

**Dashboard**

![Dashboard](docs/screenshots/dashboard.png)

**Transactions**

![Transactions table](docs/screenshots/transactions.png)

**Transaction detail**

![Transaction detail](docs/screenshots/transaction-detail.png)

**Light mode**

![Landing page in light mode](docs/screenshots/light-mode.png)

**Mobile view**

![Dashboard on a phone](docs/screenshots/mobile.png)
