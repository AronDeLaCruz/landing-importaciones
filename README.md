<p align="right">🌐 <b>English</b> | <a href="README.es.md">Español</a></p>

# OTI Importaciones

Landing page for an import consulting business. It includes an interactive quiz that recommends a course or service, a course catalog, a form builder demo, and a contact flow powered by a serverless function that emails each lead together with their quiz results.

## Features

- **Orientation quiz:** 4 questions in 3 steps, with an accessible progress bar and focus management. It recommends a course or a service based on the answers.
- **Course catalog:** filterable by category (Purchasing, Logistics, Regulations).
- **Form builder:** fields can be added and filled in, and the data is sent with the contact request.
- **Serverless contact flow:** the email is sent from a Vercel Function using Resend, so no API key ever reaches the browser.
- **Responsive design** with a global stylesheet and CSS custom properties.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Angular (standalone components, signals, new control flow) + TypeScript |
| Backend | Vercel Functions (Node.js, TypeScript) |
| Email | [Resend](https://resend.com) |
| Hosting | Vercel |

## Project structure

```
api/
  contact.ts            # Serverless function: validates the request and sends the email
src/
  app/
    app.ts / app.html   # Root component: hero, services, form builder, courses, contact CTA
    import-quiz.*       # Quiz component
    course-card.*       # Course card component
    icon.component.ts   # SVG icon component
    quiz-state.ts       # Shared service: quiz result available to the contact form
    data.ts             # Courses, filters and quiz questions
  styles.css            # Global styles
```

## How the contact flow works

```
Quiz ──► QuizState (shared signal)
                              │
Form builder fields ──────────┤
                              ▼
CTA form (email) ──► POST /api/contact ──► Vercel Function ──► Resend ──► inbox
```

`POST /api/contact` expects JSON:

```json
{
  "email": "ana@company.com",
  "details": [
    { "label": "Nombre completo", "value": "Ana Pérez" },
    { "label": "Empresa", "value": "Textiles Sur" }
  ],
  "quiz": {
    "recommendation": "Logística internacional",
    "type": "Curso recomendado",
    "answers": [
      { "question": "Etapa actual", "answer": "Ya investigué productos o proveedores" }
    ]
  }
}
```

`details` and `quiz` are optional. Only `email` is required.

| Status | Meaning |
|---|---|
| `200` | Email sent |
| `400` | Invalid email |
| `405` | Method not allowed (only `POST`) |
| `502` | Resend rejected the request |

All input is treated as untrusted: it is trimmed, length-limited, stripped of line breaks (to prevent header injection) and sent as plain text.

## Getting started

### Prerequisites

- Node.js 20 or later (22 LTS recommended)
- A [Resend](https://resend.com) account and an API key
- A [Vercel](https://vercel.com) account (free tier is enough)

### Install

```bash
git clone https://github.com/<your-username>/oti-importaciones.git
cd oti-importaciones
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```
RESEND_API_KEY=re_your_real_key
CONTACT_TO=you@example.com
```

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key (starts with `re_`) |
| `CONTACT_TO` | Inbox that receives the contact emails |

> Until you verify your own domain in Resend, you can only send from `onboarding@resend.dev` and only to the email you registered with.

Never commit `.env` or `.env.local`. Both must be in `.gitignore`. If a key is ever exposed, revoke it in Resend and create a new one.

### Run locally

`ng serve` does not run the `api/` folder, so use the Vercel CLI to run the frontend and the function together:

```bash
npx vercel dev
```

The first time, it asks you to log in and link the folder to a Vercel project (choose **Create a new project**). The app is then available at `http://localhost:3000`.

You can also test the function on its own:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Troubleshooting

- **`Header "host" ... is not allowed`:** the Angular dev server rejects the host that `vercel dev` forwards. Add it to `angular.json` under `serve > options`:
  ```json
  "allowedHosts": ["localhost", "127.0.0.1", "::1", "[::1]"]
  ```
- **`API key is invalid` (401 from Resend):** the function is reading a placeholder or an outdated value. Check that `.env` and `.env.local` don't contradict each other, and restart `vercel dev` after editing them.
- **Styles missing in child components:** the stylesheet must be global (`src/styles.css` registered in `angular.json`), not a component `styleUrl`, which Angular encapsulates.

## Deployment

1. Add `RESEND_API_KEY` and `CONTACT_TO` in **Vercel > Settings > Environment Variables**. The local `.env.local` is not uploaded.
2. Set the **Output Directory** to `dist/<project-name>/browser`.
3. Deploy:

```bash
npx vercel --prod
```

For production, verify your domain in Resend and change the `from` address in `api/contact.ts`. That also lets you send to any recipient and removes the "External" tag in inboxes.
