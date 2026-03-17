# Trip Planner UI

A React + Vite frontend for planning trips with:

- Login/Signup (saved in `localStorage`)
- Destination search in the header
- Trip plan generation (simple AI stub)
- Draggable “Recommendations” widgets that show AI-generated tips after plan generation
- Built-in chatbot panel in the header (with suggestions + replies)

> Note: This project is a UI prototype. User credentials are stored locally in the browser (`localStorage`) and are **not secure** for production.

## Tech stack

- React (Vite)
- Redux Toolkit + React Redux
- React Router
- Bootstrap + Bootstrap Icons

## Project structure (high level)

```
my_ui/
  README.md
  frontend/
    package.json
    src/
      pages/            # Welcome, Dashboard
      components/       # Header, TripForm, Recommendations, Chatbox
      redux/            # store + tripSlice
      auth/             # AuthContext (localStorage-based)
      service/          # AIModel (plan generator), chatAgent (chat replies)
      index.css
      main.jsx
```

## Requirements

- Node.js 20.19+ (or newer). Recommended: Node 22+.
- npm

## Setup

From the repository root:

```bash
cd frontend
npm install
```

## Run (development)

```bash
cd frontend
npm run dev
```

Vite will print a local URL (example: `http://localhost:5173/`).

## Build (production)

```bash
cd frontend
npm run build
```

To preview the production build:

```bash
cd frontend
npm run preview
```

## App flows

### Authentication

- Welcome page shows **Login** / **Signup** tabs.
- Signup creates an account (saved in `localStorage`).
- Login restores session (also stored in `localStorage`).
- Logout returns to the Welcome page.

### Trip planning

- Type a destination into the header search.
- Fill days/budget/companions/date/from (optional fields are allowed).
- Click **Generate Plan** to create a plan and render it in the Trip form.
- After generating a plan, the header search is cleared automatically.

### Widgets (Recommendations)

- Left panel contains draggable widgets (reorder via drag & drop).
- After a plan is generated, each widget shows an AI-generated response section underneath it.
- Widget order is persisted in `localStorage`.

### Chatbot

- In the header, click the **💬 AI** button to open the chat card.
- Includes suggestion chips and contextual replies based on current trip data.

## Local storage keys

- `tp_users_v1` — saved users (prototype only)
- `tp_session_v1` — current logged-in session
- `tp_widgets_v1` — widget order

## Troubleshooting

### “Port is in use”

If Vite says a port is already in use, it will pick the next available port automatically. Use the printed URL.

### Node/Vite version errors

If you see messages like “Vite requires Node.js …”, upgrade Node.js to a supported version and reinstall:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

