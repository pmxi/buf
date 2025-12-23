# `*buf`

A minimal paste bin. All pastes on one page, reverse chronological order. No links.

url https://buf-paste.web.app

## Stack

- Vanilla JS + plain CSS
- Firebase Firestore (database)
- Firebase Hosting

## Development

```bash
firebase serve
```

Opens at `http://localhost:5000`

## Deploy

Push to `master` (auto-deploys via GitHub Actions)

Or manually:
```bash
firebase deploy
```

## Shortcuts

Cmd+Enter / Ctrl+Enter — Save paste
