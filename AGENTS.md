# Repository Guidelines

## Project Structure & Modules
- Entry point: `app.js` wires Express, JWT auth, static assets, and mounts routers.
- Configuration: `config.js` reads env defaults; secrets and DB coords belong in `.env`.
- Data access: `repositories/` contains Sybase-backed repositories (`*-repository.js`) used by routers in `routes/`.
- Views & assets: EJS templates in `views/` (pages under `views/pages/`); shared layout/partials in `views/layout.ejs` and `views/partials/`. Static assets live in `public/css` and `public/js`.
- Docs & DB helpers: `docs/` holds UI/flow notes; `db/` has Sybase connection (`connect.js`), SQL, seeds, and fixtures.

## Build, Test, and Development Commands
- `npm install` — install dependencies (includes StandardJS for linting).
- `npm run dev` — start the Express server with `node --watch app.js`.
- `node app.js` — run the server without file watching (production-like).
- `npm test` — currently fails by design; replace with real tests when added.
- `npx standard` — run linting using the StandardJS rules in `package.json`.

## Coding Style & Naming Conventions
- ES modules only (`type: "module"`); 2-space indentation, no semicolons (StandardJS).
- Use descriptive English/Spanish names; keep files in the established patterns: `*.routes.js` for routes, `*-repository.js` for data access, `*.ejs` for views.
- Keep controllers thin: routes handle HTTP concerns, repositories handle DB/IO, views handle rendering.

## Testing Guidelines
- Add automated tests before changing critical flows (auth, repositories, scheduling). Preferred layout: `tests/feature-name.test.js`.
- Use `node --test` or a lightweight harness; stub Sybase calls when possible. Gate new tests via `npm test` once implemented.
- For UI changes, include a brief manual check list (login, protected pages, CRUD paths) in PR notes.

## Commit & Pull Request Guidelines
- Commit style mirrors history: short, imperative, often Spanish (e.g., `Ajusta login`, `Refactor rutas pacientes`). One focused change per commit.
- PRs should include: summary of intent, linked issue/trello (if any), setup notes (`.env` keys touched), and screenshots/GIFs for UI updates.
- Note breaking changes (DB schema, env vars, seed data) explicitly and provide migration steps.

## Security & Configuration Tips
- Required env vars for DB: `SYBASE_HOST`, `SYBASE_PORT`, `SYBASE_DB`, `SYBASE_USER`, `SYBASE_PASSWORD`; set `SKIP_DB=true` to bypass DB calls locally.
- Keep `SECRET_JWT_KEY` and credentials out of commits; rely on `.env` and deployment secrets.
- If Sybase Java bridge is moved, set `SYBASE_JAVA_BRIDGE` to the jar path; use `SYBASE_DEBUG=true` for verbose logs during troubleshooting.
