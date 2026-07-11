# Next.js Todo Demo

A full-stack todo app built with **Next.js 15** (App Router), featuring JSON REST API routes and a client-side UI that calls them.

## Features

- Add, complete, and delete todos
- REST API with consistent JSON responses
- In-memory data store (resets on server restart)
- TypeScript throughout
- Dark-themed UI

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm, yarn, or pnpm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Reference

All endpoints return JSON in this shape:

```json
{
  "success": true,
  "data": { ... }
}
```

On error:

```json
{
  "success": false,
  "error": "Error message"
}
```

### List all todos

```http
GET /api/todos
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Learn Next.js App Router",
      "completed": true,
      "createdAt": "2026-07-12T00:00:00.000Z"
    }
  ]
}
```

### Create a todo

```http
POST /api/todos
Content-Type: application/json

{
  "title": "Buy groceries"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-07-12T00:00:00.000Z"
  }
}
```

### Get a single todo

```http
GET /api/todos/:id
```

### Update a todo

```http
PATCH /api/todos/:id
Content-Type: application/json

{
  "completed": true
}
```

Or update the title:

```json
{
  "title": "Updated title"
}
```

### Delete a todo

```http
DELETE /api/todos/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here"
  }
}
```

## Try the API with curl

```bash
# List todos
curl http://localhost:3000/api/todos

# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test from curl"}'

# Toggle complete (replace ID)
curl -X PATCH http://localhost:3000/api/todos/YOUR_ID \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete (replace ID)
curl -X DELETE http://localhost:3000/api/todos/YOUR_ID
```

## Project Structure

```
src/
├── app/
│   ├── api/todos/          # JSON API routes
│   │   ├── route.ts        # GET, POST /api/todos
│   │   └── [id]/route.ts   # GET, PATCH, DELETE /api/todos/:id
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── TodoApp.tsx         # Client UI with fetch calls
├── lib/
│   ├── api.ts              # Frontend API client
│   └── todo-store.ts       # In-memory store
└── types/
    └── todo.ts             # Shared TypeScript types
```

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production   |
| `npm run start` | Start production server |
| `npm run lint`  | Run ESLint             |
