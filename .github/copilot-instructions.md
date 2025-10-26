<!-- .github/copilot-instructions.md -->
# Smart-LMS — Copilot instructions for code changes

Summary
- This repository contains a React frontend (`smart-lms-frontend`) and a Node.js backend (`smart-lms-backend`). The backend talks to two databases: MSSQL (core data) and MongoDB (content). Use these notes to make safe, focused changes.

Quick architecture notes
- Backend: `smart-lms-backend/src` — Express app in `src/app.js`. Routes are registered in `src/routes/index.js` (mounts `/api/auth`, `/api/courses`, `/api/progress`, `/api/ai`).
- DB wiring:
  - MSSQL connection: `smart-lms-backend/config/database.js` — uses `mssql/msnodesqlv8` and Windows Trusted Authentication (msnodesqlv8). Changing SQL access requires Windows auth awareness; non-Windows environments must use different driver/credentials.
  - MongoDB: `smart-lms-backend/src/utlis/mongodb.js` — connects to `mongodb://localhost:27017/smart_lms` using `mongoose`.
- Utilities: DB helpers live in `smart-lms-backend/src/utlis` (note folder spelled `utlis` not `utils`) — e.g., `mssql.js` provides `executeQuery`, `executeProc`, `transaction`, etc. Prefer using these helpers for DB operations.

Developer workflows & common commands
- Start backend (PowerShell):
  ```powershell
  cd smart-lms-backend
  npm install
  npm run start   # runs `node src/app.js`
  ```
- Start frontend (PowerShell):
  ```powershell
  cd smart-lms-frontend
  npm install
  $env:PORT=3001; npm run start
  ```
- Health check endpoints to validate wiring:
  - Backend root: GET `/` returns a basic message (see `src/app.js`).
  - MSSQL test: GET `/api/test-db` executes `SELECT @@VERSION` using the configured pool (see `src/app.js`).

Health-check examples
- Quick checks you can run locally to confirm the server and DB are reachable.

- Root (server alive)

  curl -sS http://localhost:5000/

  PowerShell:

  Invoke-RestMethod http://localhost:5000/

- MSSQL connection test (uses `poolPromise` endpoint)

  curl -sS http://localhost:5000/api/test-db | jq

  PowerShell:

  Invoke-RestMethod http://localhost:5000/api/test-db


Project-specific conventions & gotchas
- Folder name typo: `src/utlis` (and `smart-lms-backend/src/utlis/*`) — don't create `utils` duplicates; follow existing spelling.
- DB connection placement: MSSQL config is under `smart-lms-backend/config/database.js` (not `src/config`). Use `poolPromise` exported there.
- Requests/response shape: many routes return `{ success: boolean, ... }` with `recordset` mapping. Look at `src/utlis/mssql.js` for how `recordset` is used and wrap/normalize responses when adding new endpoints.
- app.js contains multiple `require`/middleware registrations — be cautious when refactoring: app is exported early and then server is started later in the same file.

Integration points & external deps
- MSSQL: `mssql` + `msnodesqlv8` (Windows trusted auth). Editing queries or migrations affects `smart-lms` database referenced in `config/database.js`.
- MongoDB: local `mongodb://localhost:27017/smart_lms` — content and learning material models live in `smart-lms-backend/src/models` (e.g., `materialModel.js`, `userModel.js`).
- Frontend: React + `axios` (see `smart-lms-frontend/src/services/api.js`) — mind CORS and the backend base URL when changing API paths.

When making changes
- Prefer small, reversible commits touching a single area (route, model, util). Include which environment (Windows/Unix) the change targets.
- If you change MSSQL access, add a note explaining Windows Auth implications or provide alternate env-based connection string for non-Windows CI.
- Update or add a quick manual test: endpoint + expected DB check (e.g., hitting `/api/test-db`).

Where to look first (quick links)
- `smart-lms-backend/src/app.js` — entry and middleware
- `smart-lms-backend/config/database.js` — MSSQL + `poolPromise`
- `smart-lms-backend/src/utlis/mssql.js` — DB helper patterns
- `smart-lms-backend/src/utlis/mongodb.js` — Mongo connection
- `smart-lms-backend/src/routes/index.js` and `smart-lms-backend/src/routes/*.js` — routing conventions
- `smart-lms-backend/src/models/*.js` — Mongoose schemas and model usage
- `smart-lms-frontend/src/services/api.js` — frontend API wrapper (axios)

If something is unclear
- Ask which environment you plan to run (Windows vs Linux/CI) — MSSQL driver differs.
- Point to the specific route or model file you want to change; include a short example request/response you expect.

End
