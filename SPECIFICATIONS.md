# CEP/Claroline – Application Specifications

This document centralizes functional specifications and operational conventions across the Claroline platform, Former22 middleware, and the Admin UI. It starts with the Archive Mode feature and the related behaviors implemented in September 2025.

--------------------------------------------------------------------

## 1) Archive Mode (Year Scoping)

Goal: Control which sessions/events are visible by default based on year, to either focus on the recent period or to browse older archives.

### 1.1. Terminology

- Current Year: The server calendar year at runtime.
- Previous Year: Current Year − 1.
- Archive Threshold Year: Current Year − 2.

### 1.2. Configuration

- Environment variable: `ARCHIVE_MODE`
  - `0` (or unset/false): Normal mode
  - `1` (or true): Archive mode

Where to set:
- Claroline: `Claroline/.env.local`
- Former22: `cep-former22/.env`

### 1.3. Claroline – Default Scope Rules

Claroline reads `ARCHIVE_MODE` via a `YearScope` service and injects default filters on list queries with an event listener on `objects.search`.

- Normal mode (`ARCHIVE_MODE=0`): show only Current Year and Previous Year.
  - Finder filters injected: `year = [currentYear, currentYear - 1]`.

- Archive mode (`ARCHIVE_MODE=1`): show items older than the previous year.
  - Finder filters injected: `yearBefore = currentYear - 2` (meaning all years ≤ threshold).

Affected Claroline lists (non‑exhaustive):
- Cursus Sessions
- Cursus Session Users (registrations)
- Cursus Events (session events)

Request overrides:
- If a request explicitly sets `filters[year]` or `filters[yearBefore]`, those values take precedence over the default injected filters.

Notes:
- Detail endpoints by UUID (e.g., `GET /apiv2/.../{id}`) are not list queries and thus are not subject to the default scoping.
- The public sessions endpoint may also include extra filters like `terminated=false` which can influence visibility independently of year scoping.

### 1.4. Former22 – Default Scope Rules

Former22 reads `ARCHIVE_MODE` from environment (via dotenv) and applies date comparisons around January 1st of the Previous Year.

Reference date:
- `yearMinusOne()` = `new Date(CurrentYear - 1, 0, 1)` (i.e., Jan 1 of Previous Year in local time).

Rules:
- Normal mode (`ARCHIVE_MODE=0`): `start_date > yearMinusOne()`
  - Includes all sessions/events strictly after Jan 1 of Previous Year (this generally includes the full Previous Year after Jan 1, Current Year, and future dates).

- Archive mode (`ARCHIVE_MODE=1`): `start_date < yearMinusOne()`
  - Includes sessions/events strictly before Jan 1 of Previous Year (i.e., older than the previous year).

Affected Former22 endpoints (non‑exhaustive):
- `GET /sessions` and `GET /sessions/seances`
- `GET /agenda`
- `GET /courses`
- `GET /events`
- `GET /evaluations`

Implementation notes:
- Former22 uses Prisma to query Claroline’s database directly; the year window is implemented via `gt/lt` comparisons against `yearMinusOne()`.
- Admin UI (see 1.5) consumes these endpoints; no additional client filtering is required for visibility, only for navigation.

### 1.5. Admin UI – Agenda Start Date Behavior

Problem: In Archive mode, “today” may be empty (no events for Current/Previous Year). The calendar should open where data actually exists.

Behavior:
- After agenda events load, the UI computes the event date closest to “today” and navigates the calendar to that date (`gotoDate(nearestStart)`).
- This makes the agenda immediately show the most relevant time window, even when the dataset is archival.

Alternatives:
- If needed, this can be switched to “always jump to the latest event date” (max start) instead of “closest to today.”

### 1.6. Operational Steps

Toggle and test:
1) Set env vars
   - Claroline: update `Claroline/.env.local` with `ARCHIVE_MODE=0|1`.
   - Former22: update `cep-former22/.env` with `ARCHIVE_MODE=0|1`.
2) Restart services
   - Claroline (Docker): warm Symfony cache (e.g., `php bin/console cache:warmup`) after changing env.
   - Former22: restart the server (PM2 or `npm run start:dev`) so dotenv is re‑read.
3) Verify endpoints/UI
   - Claroline API lists reflect the correct year window.
   - Former22 endpoints (`/agenda`, `/sessions`, etc.) reflect the correct window.
   - Admin UI agenda opens on a date with events.

Known differences (by design):
- Claroline Normal mode limits to exactly Current + Previous Year.
- Former22 Normal mode uses a cutoff date (> Jan 1 Previous Year), which may include future dates. This can be aligned to exact years if required.

--------------------------------------------------------------------

## 2) Spec Template (for future features)

Use the following structure for each new specification:

**Feature Name**
- Problem/Goal: concise statement
- Scope: where it applies (Claroline / Former22 / Admin UI)
- Configuration: env vars / parameters
- Behavior: precise rules, edge cases, overrides
- API: endpoints affected, request/response changes
- UI: views affected, navigation/state considerations
- Operational: how to deploy/enable/verify
- Notes: trade‑offs, known differences, performance concerns

--------------------------------------------------------------------

## 3) Changelog (high‑level)

- 2025‑09: Archive Mode year scoping added across Claroline and Former22; Admin UI agenda auto‑centering on nearest event date.

