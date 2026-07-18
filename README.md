![logo](frontend/public/kfkd_logo.png)

# Katas For Knowledge Distillation

A personal tool for tracking and practicing coding katas. Write them down, solve them, track your progress over time.



---

## What it does

- **Log katas** — store the kata code, notes, difficulty, and tags
- **Practice** — open a kata to get a split view: kata on the left, scratch pad on the right with Go syntax highlighting and a focus mode to block distractions
- **Track solves** — record each solve attempt with a duration and a quality rating (1–5)
- **Visualise activity** — a GitHub-style heatmap shows your solve history over the last 6 months

---

## Stack

| Layer | Tech |
|---|---|
| Backend | Go, SQLite (`bun` ORM) |
| Frontend | Next.js 15, TypeScript, Tailwind v4, shadcn/ui |
| Package manager | pnpm |

---

## Project structure

```
├── backend/
│   └── internal/katas/
│       ├── controller/http/   # HTTP handlers, router, middleware
│       ├── entity/            # Domain types
│       ├── repo/              # SQLite queries
│       └── service/           # Business logic
├── frontend/
│   ├── app/
│   │   ├── katas/             # List page (table + heatmap)
│   │   ├── katas/new/         # Add kata form
│   │   └── katas/[id]/        # Kata detail + scratch pad
│   ├── components/            # UI components
│   └── lib/                   # API client
├── sqlitekatas.db
└── Makefile
```

---

## Getting started

### Prerequisites

- Go 1.22+
- Node.js 18+
- pnpm

### Run

```bash
# Clone
git clone https://github.com/you/katas.git
cd katas

# Start both backend and frontend
make start

# Or individually
make backend-start
make frontend-start
```

Backend runs on `http://localhost:8083`, frontend on `http://localhost:3000`.

### Other make commands

```bash
make stop              # stop both
make restart           # rebuild and restart both
make backend-restart   # rebuild and restart backend only
make frontend-restart  # restart frontend only
make status            # check what's running
make logs-backend      # tail backend logs
make logs-frontend     # tail frontend logs
```

---

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/kata/list` | List all katas |
| `GET` | `/kata/{id}` | Get a single kata |
| `POST` | `/kata` | Create or update a kata (upsert on title, updates `content` and `note`) |
| `DELETE` | `/kata/{id}` | Delete a kata |
| `POST` | `/solve` | Record a solve attempt |
| `GET` | `/kata/solved` | Get daily solve counts for the last 6 months |

### Kata payload

`content` and `note` must be **base64-encoded** when sending to the API. The frontend handles this automatically.

```json
{
  "title": "Fibonacci",
  "content": "<base64>",
  "note": "<base64>",
  "difficulty": "medium",
  "lines": 12,
  "tags": ["recursion", "math"]
}
```

### Solve payload

```json
{
  "kata_id": 1,
  "duration_sec": 420,
  "quality": 4
}
```

---

## Usage

### Adding a kata

Click **Add kata** on the list page, fill in the title, paste the kata code into the content field, set difficulty and tags, and save.

### Practicing

Click any row in the table to open the kata. The left panel shows the kata code and your notes (both editable). The right panel is a scratch pad to write your solution. Hit **Focus** to dim the left panel and concentrate on the code.

When done, set the duration and quality (1–5), then hit **Solve** to record the attempt. Hit **Save** to persist any edits to the kata or notes.

### Activity heatmap

The heatmap on the list page shows how many katas you solved each day over the last 6 months — darker green means more solves.

---

## License

MIT