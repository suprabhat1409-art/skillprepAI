SkillPrep AI Agent — Starter Scaffold

This repository is organized as a `client/` + `server/` monorepo for the SkillPrep AI Agent platform.

Structure:
- `client/` — React frontend
- `server/` — Express backend, models, routes, and AI agent stubs
- `docs/` — project documentation

Quick start (Windows PowerShell):

```powershell
npm install
npm run dev:server
npm run dev:client
```

The backend exposes a simple `/api/ping` check and a stub resume analysis route. The frontend is a Vite React starter wired to the new `client/` workspace.

Postman test files are available in [docs/postman](docs/postman). Import the collection and local environment, then run the requests in this order:

1. `Auth > Register`
2. `Auth > Login`
3. `Resume > Upload Resume`
4. `Resume > Get Resume By User`
5. `Resume > Delete Resume By Id`
6. `Resume > Analyze Resume`
7. `Health > Ping`

The resume API routes are:

- POST `/api/resume/upload`
- GET `/api/resume/:userId`
- DELETE `/api/resume/:id`
