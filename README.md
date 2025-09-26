# Transport Requisition App

A full-stack web application for submitting and approving business travel requests. It mirrors the organisation's business travel form and automates the approval workflow across Requestors, Heads of Department, Head of Human Resource & Administration, Chief Executive Officer, and Chairman.

## Project Structure

```
transport-requisition-app/
├── server/   # Express + TypeScript + MongoDB backend
└── client/   # React + Vite + TypeScript frontend
```

## Features

- Employee authentication using employee ID and password (JWT based).
- Role-based access control with sequential approvals.
- Travel request capture with traveller details, requirements, and calculations.
- Dashboards for requestors and approvers (pending approvals queue).
- Email notification service (logs to console until SMTP credentials supplied).

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB 6+ (local instance or Atlas cluster)

## Backend Setup (`server`)

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create an `.env` file using the provided `.env.example` template and update values:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/transport_requisition
   JWT_SECRET=super-secret-value
   JWT_EXPIRES_IN=12h
   EMAIL_FROM=no-reply@example.com
   SMTP_HOST=
   SMTP_PORT=587
   SMTP_USER=
   SMTP_PASSWORD=
   FRONTEND_URL=http://localhost:5173
   ```
   Leaving the SMTP variables blank will cause the email service to log payloads instead of sending real emails.
3. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:4000/api`. Confirm the service with `GET /health`.

## Frontend Setup (`client`)

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. (Optional) Create a `.env` file to override the backend base url:
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```
   The default already points to `http://localhost:4000/api`.
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

The app will be reachable at `http://localhost:5173`.

## Running Tests & Builds

- Backend type-check/build: `npm run build` inside `server`.
- Frontend type-check/build: `npm run build` inside `client`.

## Seeding Users

At the moment, administrators can create accounts via the backend `POST /api/auth/register` endpoint. Seed initial users (Requestor, Head of Department, Head HR & Admin, CEO, Chairman) and share credentials with your team. A future enhancement can expose an admin UI for managing accounts.

## Next Steps

- Hook the email service to your SMTP or transactional provider.
- Add auditing/reporting exports (PDF/CSV) to the dashboard.
- Implement fine-grained department-based approval routing if multiple Heads of Department exist.
