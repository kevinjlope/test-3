# Fifty Flowers - Product Management System

A high-performance product management interface for Fifty Flowers' catalog. Built with React Router 7, prioritizing Type-Safety, industry-standard UX patterns, and a Layered Service Architecture.

## Technical Stack

- **Framework:** React Router 7 (Framework Mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Nova Style)
- **Database:** SQLite (`better-sqlite3`)
- **ORM:** Drizzle ORM
- **Validation:** Zod + react-hook-form
- **D&D:** `@dnd-kit/sortable`
- **Infrastructure:** Docker + Docker Compose

## Key Features

- **Professional CRUD:** Full management of flower products with image support.
- **Layered Architecture:** Decoupled business logic (Services) from UI and Infrastructure.
- **Advanced UX:**
  - **Soft Delete + Undo:** 5-second window to revert deletions via Sonner toasts.
  - **Optimistic UI:** Immediate feedback on deletions and edits.
  - **Debounced Search:** 300ms server-side search driven by URL parameters.
  - **Multi-select Filter:** Elegant category filtering.
  - **Drag-and-Drop:** Smooth image reordering persisted in the database.
- **Type Safety:** Strict TypeScript throughout (no `any`).
- **Performance:** React.cache for data deduplication and memoized components.

## Setup & Run

### Using Docker (Recommended)

1. Ensure you have Docker and Docker Compose installed.
2. Run:
   ```bash
   docker-compose up --build
   ```
3. Access the app at `http://localhost:3000`.

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate and run migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Automated Testing

The project includes a robust testing suite covering both logic and E2E flows:

- **Unit Testing (Vitest):** Validates the Zod schema, including happy paths and edge cases (price validation, mandatory images, character limits).
  - Run: `npm test`
- **E2E Testing (Playwright):** Full lifecycle simulation (Create -> Search -> Edit -> Soft Delete -> Undo).
  - Run: `npm run test:e2e` (Headless)
  - Run: `npx playwright test --ui` (Interactive)

## Technical Decisions

For a deep dive into our architectural choices, trade-offs, and senior-level rationale, please refer to the **[Architecture Documentation](./ARCHITECTURE.md)**.

- **React Router 7 Monolith:** Chosen for high velocity and framework-level data handling (loaders/actions) which simplifies optimistic UI.
- **Service Layer Pattern:** Logic is isolated in `app/services/ProductService.ts` to keep routes lean and make the system testable and scalable.
- **SQLite + Drizzle:** Perfect for this scope—extremely fast, zero-config, and type-safe.
- **Base UI (Nova Style):** Leveraged the latest shadcn/ui trends for a modern, accessible admin dashboard experience.
