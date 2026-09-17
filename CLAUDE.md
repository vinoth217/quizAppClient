# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (proxies `/api` to the quiz server, see below)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — run oxlint

There is no test suite in this repo.

## Architecture

This is the client half of a two-repo quiz app (server lives in a sibling `quizAppServer` repo, deployed at `https://quizappserver-7707.onrender.com`). The client is a minimal single-page React 19 + Vite app with no router and no state management library — all state lives in one component.

- `src/App.jsx` — the entire UI as a single component with a manual state machine driven by one `screen` state var: `topic` → `loading` → `quiz` → `score`. All quiz-taking logic (scoring, advancing questions, revealing answers) lives here.
- `src/api.js` — the only network boundary. `fetchQuiz(topic)` POSTs to `/api/quiz` and returns a `questions` array of `{ question, options, answerIndex }`.
- `src/main.jsx` — standard React root mount, no additional setup.

API base URL resolves via `VITE_API_URL` (see `.env`); in dev, Vite's proxy in `vite.config.js` forwards `/api` to the deployed server directly, so `npm run dev` talks to the live backend unless you override it.

When adding features, keep in mind this app intentionally has no routing, no global state library, and no component splitting beyond `App.jsx` — match that minimalism rather than introducing new abstractions for a single-screen quiz flow.
