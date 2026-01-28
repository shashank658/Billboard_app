# Repository Constitution (agents.md)

## 1) Title & Purpose
This document is the binding constitution for this repository. It applies to all human contributors and AI agents. Any contribution that conflicts with this file is invalid unless explicitly approved in writing. This file has the highest precedence over all other documents, configs, and conventions.

## 2) Core Engineering Principles
- Simplicity over cleverness.
- Type safety is a feature, not optional.
- Server-first architecture with minimal client JavaScript.
- Explicit over implicit behavior and dependencies.
- Consistency over individual preference.

## 3) Repository Architecture
- The Next.js App Router (`app/`) is the source of truth for routing and layout.
- Use route groups for logical separation without URL impact.
- Layouts define shared structure; `loading.tsx` and `error.tsx` are required where long/fragile operations exist.
- Server Components are the default. Client Components require justification and must be minimal.
- Naming conventions:
  - Files and folders use kebab-case by default.
  - React components use PascalCase.
  - Utility modules use lowerCamelCase.
- Business logic MUST live in dedicated domain or service modules (e.g., `lib/`, `services/`, `server/`).
- Business logic MUST NOT live in:
  - React components (except trivial UI formatting).
  - Route handlers and Server Actions (they orchestrate only).
  - Database schema files.

## 4) Next.js Standards
- Server Components are the default; Client Components require a documented reason.
- Client Components MUST be marked with `"use client"` and kept leaf-level where possible.
- Server Actions are preferred for mutations.
- Route Handlers are for non-UI APIs, webhooks, or third-party callbacks.
- Data fetching:
  - RSC-first; prefer `fetch` in Server Components.
  - Explicit caching and revalidation; default to `no-store` unless justified.
- Error handling:
  - Use typed errors and return user-safe messages.
  - Log internal errors server-side with context.
- Redirects:
  - Use `redirect()` in server contexts and `useRouter()` only in clients.
- Middleware:
  - Use only for auth gating and light request shaping.
  - Heavy logic belongs in server code.
- Runtime:
  - Default to Node.js runtime.
  - Edge runtime only when justified and documented.

## 5) TypeScript Rules
- `strict: true` mindset at all times.
- `any` is forbidden. Use `unknown` with proper refinement when required.
- Shared types MUST be centralized in `types/` or `lib/types/`.
- Zod is the source of truth for validation and typing.
- Runtime validation is required for all external inputs.
- Clear separation of types:
  - Input schemas (Zod)
  - Database models (Drizzle)
  - Domain types (business logic)
  - API/view models (serialization)

## 6) Database & ORM (Drizzle + Neon)
- Postgres-first design; model data intentionally, not afterthought.
- Drizzle is the only schema definition source.
- Migrations use drizzle-kit; no manual SQL migrations unless approved.
- Naming conventions:
  - Tables: snake_case plural nouns.
  - Columns: snake_case.
  - Indexes: `idx_<table>_<columns>`.
  - Foreign keys: `fk_<table>_<ref_table>`.
- Transactions are mandatory for multi-step mutations.
- Serverless connection handling must use Neon best practices (pooling, reuse).
- Indexing and constraints are required for query performance and integrity.
- Seed data is required for local development and must be deterministic.
- Database access is ONLY allowed through approved data-access layers. Direct access elsewhere is forbidden.

## 7) Authentication & Authorization (Clerk)
- Clerk is the only authentication provider.
- Auth must be enforced at server boundaries.
- Authorization checks are mandatory for all mutations.
- Never trust client-side auth state for security decisions.
- Roles/permissions must exist, even if minimal; default deny.
- Clerk middleware is the standard gate for protected routes.
- User identity access must be server-side and typed.

## 8) API & Server Action Standards
- Prefer Server Actions for mutations.
- Inputs and outputs MUST be typed.
- Validate all inputs before execution.
- Use a clear error taxonomy: auth, validation, system.
- No silent failures; errors must be surfaced or logged.
- Idempotency is required where applicable (payments, retries, webhooks).

## 9) UI & Frontend Standards (shadcn + Tailwind)
- shadcn components live in `components/ui`.
- App-specific components live outside `components/ui`.
- Tailwind-first styling; no ad-hoc CSS files.
- Create reusable components when used in 2+ places; otherwise keep local.
- Accessibility is mandatory:
  - Keyboard navigation support.
  - Visible focus states.
  - ARIA attributes where needed.
- Responsive design is required for all new UI.
- Forms SHOULD use react-hook-form with Zod.

## 10) Security & Privacy
- Secrets MUST use environment variables only.
- `.env.example` is required and kept current.
- Never log secrets or PII.
- Sanitize and validate all external input.
- Maintain baseline OWASP Top-10 awareness.
- Rate limiting is required for public endpoints.
- Postgres RLS MAY be adopted later; if enabled, all access MUST comply.

## 11) Performance & Scalability
- Avoid unnecessary client components.
- Monitor bundle size; avoid heavy dependencies.
- Prevent N+1 queries; batch and join where possible.
- Use streaming and suspense intentionally.
- Vercel deployment constraints MUST be considered (cold starts, edge limits).

## 12) Testing & Quality Gates
- Unit tests are required for domain logic.
- E2E tests (Playwright) are required for critical user flows.
- UI tests may be skipped for static content with justification.
- CI gates before merge:
  - Typecheck
  - Lint
  - Tests

## 13) Git Workflow & PR Rules
- Branch naming: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`.
- Commit messages MUST be concise and imperative (e.g., "Add auth guard").
- PRs MUST be small and reviewable.
- PRs MUST include checklist completion and testing notes.
- Definition of Done must be met before merge.

## 14) Documentation Rules
- Update README when behavior, setup, or workflows change.
- Inline documentation should explain why, not what.
- ADR-lite notes are required for significant decisions.

## 15) Decision Policy
- If requirements are unclear, stop and document assumptions.
- AI agents MUST prefer conservative, reversible changes.
- Escalate when security, billing, or data integrity is ambiguous.

## 16) Appendix

### PR Checklist
- [ ] Requirements met and documented
- [ ] Auth and authorization validated
- [ ] Tests run and results recorded
- [ ] Typecheck and lint pass
- [ ] Documentation updated if needed

### Definition of Done
- All tests pass or failures are justified
- CI gates satisfied
- No unresolved TODOs
- Approved by at least one reviewer

### Folder Structure Example
```
app/
  (marketing)/
  (dashboard)/
  api/
components/
  ui/
lib/
services/
types/
```

### Common Anti-Patterns
- Client Components for server-only work
- Using `any` to bypass type safety
- Data access outside approved layers
- Missing authorization checks on mutations
- Silent error swallowing
