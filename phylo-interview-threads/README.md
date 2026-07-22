# Phylo · Messages

A small Slack-style channel app. This is an interview surface: a working
messaging UI backed by a mocked API, with two features left for you to build.

## Stack

- **web/** — Vite + React + TypeScript frontend
- **server/** — Express + TypeScript backend with an in-memory "database"
  (everything resets on restart; no real persistence)

The frontend calls `/api/*`, which Vite proxies to the server in dev.

## Run it

```bash
npm install        # installs both workspaces
npm run dev        # starts server (:8787) and web (:3050) together
```

Then open **http://localhost:3050**.

You can also run them separately: `npm run dev:server` and `npm run dev:web`.

Type-check everything with `npm run typecheck`.

## What works today

- Loading the signed-in user, the channel, and its messages from the API
- Acting as any of the seeded users (the switcher at the bottom of the sidebar)
- Sending a new message (persists in server memory for the session)

## Your task

Two features, built one at a time. Start with the simplest correct version of
each and we'll add wrinkles together as we go — treat it like a design chat,
not a spec to fill in.

1. **Emoji reactions** — let people react to a message with an emoji and show
   the count (the Slack/Linear "👍 3" pill).
2. **Threaded replies** — let a message have a thread of replies.

Look for `TODO(candidate)` markers — they point at the natural seams:

| Where | File |
| --- | --- |
| Domain types (reactions/threads not modeled yet) | `server/src/types.ts`, `web/src/types.ts` |
| Seed data + in-memory store | `server/src/db.ts` |
| API routes ("candidate work starts here") | `server/src/index.ts` |
| API client | `web/src/api.ts` |
| Message UI (reaction bar + reply entry point) | `web/src/components/Message.tsx` |

There's no hidden "right answer." We're interested in how you model the data,
the trade-offs you name, and how you reason when something misbehaves.

Reaction-pill and thread styling already exists in `web/src/styles.css`
(`.reactions`, `.reaction`), so the feature looks right the moment your markup
lands — focus on behavior, not CSS.
