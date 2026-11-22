# CareerAI Frontend

The CareerAI frontend is a React application for placement candidates to create and review role-specific interview plans. It provides account registration and login, job-description and profile input, generated interview reports, saved-plan management, theme switching, and resume PDF downloads.

For the complete product overview, architecture, API reference, backend setup, and n8n integration, see the [project README](../Readme.md).

## Run locally

Install dependencies and create `Frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Then start the frontend:

```bash
npm install
npm run dev
```

The backend must be running and configured to allow the Vite origin (usually `http://localhost:5173`) in `FRONTEND_URLS`. See the [project setup instructions](../Readme.md#run-locally) for MongoDB, Gemini, and backend environment variables.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production frontend build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Source layout

```text
src/
├── features/
│   ├── auth/       # Registration, login, protected routes, auth state
│   └── interview/  # Plan creation, saved plans, report view, API calls
├── app.routes.jsx
├── App.jsx
└── main.jsx
```

The Vercel configuration in this directory provides the SPA fallback and forwards `/api/*` requests to the configured backend deployment. Set `VITE_API_URL` when the frontend should call a different backend origin.
