# 📘 Project Best Practices

## 1. Project Purpose
A monorepo Shopify app template using React (Vite) for the frontend and Firebase Cloud Functions (Koa) for the backend. It supports embedded and standalone modes, integrates with Shopify App Bridge and Polaris UI, and uses Firestore for persistence. The repo is optimized for local development with Shopify CLI and Firebase emulators.

## 2. Project Structure
- Root
  - package.json (Yarn workspaces): orchestrates assets and functions packages
  - firebase.json, firestore.rules, firestore.indexes.json: Firebase configuration
  - jest.config.js, .eslintrc.js, .prettierrc, .editorconfig: lint/format/editor setup
  - scripts/: helper scripts (e.g., updateLocalUrl)
  - extensions/: Shopify extensions (theme extension, etc.)
  - static/: Vite build output target
  - shopify.*.toml: Shopify app configuration
- packages/assets (Frontend)
  - vite.config.js: Vite with env injection, HTTPS, Shopify-aware proxying, alias (@assets, @functions)
  - src/
    - actions/, reducers/: simple state management via reducer and context
    - components/: reusable UI pieces, ErrorBoundary, AppBridgeProvider
    - config/: environment and route prefix handling (embedded vs standalone)
    - const/: constants (e.g., app route prefixes)
    - helpers/: utilities, API helpers, env checks
    - hooks/, contexts/: React hooks and context providers (e.g., MaxModal)
    - layouts/: Embedded and Full layouts
    - loadables/: React.lazy wrappers for code-splitting
    - pages/: feature pages (Home, Samples, Settings, Tables, etc.)
    - routes/: react-router-dom v5 routes (Switch/Route), embedded path prefixing
    - services/: domain services (shop data shaping, error, crisp)
    - styles/: global styles (SCSS)
    - App.js, embed.js, main.js, standalone.js: entry points per mode
- packages/functions (Backend)
  - src/
    - handlers/: Koa apps for api, apiSa (standalone), auth, authSa
    - routes/: API route definitions (api.js) using koa-router
    - controllers/: request controllers
    - repositories/: Firestore access layer (repository pattern)
    - middleware/: error handling middleware
    - helpers/: API/utility helpers
    - config/: app and shopify config via functions.config()
    - presenters/, services/: business logic and presentation helpers
    - index.js: Firebase HTTPS onRequest bindings to handlers
  - views/: EJS templates for error pages
  - .runtimeconfig.json: local runtime config scaffold

Conventions
- Path aliases: @assets -> packages/assets/src, @functions -> packages/functions/src
- Embedded vs standalone routing: routePrefix derived from IS_EMBEDDED_APP
- Build output: assets builds to static/ (embed and standalone HTML/JS)

## 3. Test Strategy
Current state
- Jest is configured at the root, but no test suites are present yet.

Recommended approach
- Framework: Jest for both frontend and backend.
- Frontend structure: packages/assets/src/__tests__ or co-located *.test.js next to modules.
  - Use @testing-library/react for components.
  - Mock network with MSW (Mock Service Worker) or jest.mock for axios.
  - Route tests: use MemoryRouter and routePrefix helpers.
- Backend structure: packages/functions/test or __tests__ under src units.
  - Unit test controllers/middleware with Koa’s context mocks.
  - Integration tests using Firebase Emulator Suite for Firestore and functions.
  - Optionally use supertest to exercise Koa routers before binding to Firebase.

Philosophy & coverage
- Prefer fast unit tests for pure logic (helpers, repositories with emulator) and thin controller tests.
- Add integration tests for critical flows (auth verification, subscription CRUD, shop lookup).
- Target 80%+ coverage on helpers, repositories, controllers; UI snapshot tests sparingly.

Mocking guidelines
- Frontend: mock App Bridge and Polaris where needed; avoid testing Polaris internals.
- Backend: mock Shopify API calls and external HTTP via nock or jest mocks; use emulator for Firestore.

## 4. Code Style
Languages & tooling
- JavaScript/React 18 with Vite; Node 20 for functions.
- ESLint (Google style) + Prettier formatting; EditorConfig normalizes whitespace.

General conventions
- Naming: camelCase for variables/functions; PascalCase for React components and directories under components/pages; file names match exported component names.
- Modules: prefer function exports; group related exports in index.js where appropriate.
- Immutability: avoid in-place mutations; spread objects/arrays when updating state.

React
- Use functional components and hooks.
- Code-splitting with React.lazy and loadables/ wrappers.
- Routing via react-router-dom v5 (Switch/Route). Respect routePrefix from config/app.
- Wrap app in Polaris AppProvider and AppBridgeProvider when embedded.
- Error boundaries: wrap routes with components/ErrorBoundary.

Async & data
- Use services for API/data shaping (e.g., services/shopService.js).
- Centralize API calls through helpers (frontend api helper; backend helpers/api.js or repositories).
- Handle loading and toasts via actions/storeActions and StoreProvider context.

Comments & docs
- JSDoc for exported functions where non-trivial.
- Keep components self-documenting; add inline comments for rationale or tricky logic.

Error/exception handling
- Backend: always rely on middleware/errorHandler to format errors (JSON vs HTML based on Accept header) and emit events.
- Frontend: use services/errorService for user-facing errors and ErrorBoundary for render failures.

## 5. Common Patterns
- Repository pattern for Firestore collections (subscriptionsRepository, shopRepository).
- Controller–Router–Handler layering in functions:
  - handlers/* compose Koa app with middleware and route mounting
  - routes/* exposes routers (prefix via getApiPrefix)
  - controllers/* focus on request orchestration and returning ctx.body
  - repositories/* encapsulate persistence operations
- Environment-driven configuration with vite-plugin-environment and functions.config().
- Embedded vs standalone feature toggle via IS_EMBEDDED_APP; prepend/strip routePrefix helpers.
- Lazy-loading loadables/* for pages to improve initial load.
- Centralized state via StoreProvider (context + reducer) with typed action names.

## 6. Do's and Don'ts
✅ Do
- Use routePrefix and prependRoute/removeRoute helpers to build URLs.
- Keep API integrations in services/helpers; keep components presentational when possible.
- Use repositories for all Firestore access; avoid direct Firestore calls in controllers.
- Validate and sanitize inputs in controllers before passing to repositories.
- Always return JSON payloads from controllers (set ctx.body) and rely on error middleware.
- Use React.lazy and Suspense for non-critical routes; keep above-the-fold small.
- Keep env variables in .env.* (frontend) and .runtimeconfig.json (backend); never hardcode secrets.
- Run eslint and prettier before committing; keep imports ordered and clean.

❌ Don’t
- Don’t hardcode embedded/standalone paths; avoid absolute paths without routePrefix.
- Don’t access window.* in shared code; keep browser-only usage inside frontend components.
- Don’t couple controllers to Firestore directly; keep testable with repository abstraction.
- Don’t swallow errors; throw or let middleware handle them.
- Don’t mutate React state directly; avoid side effects in render.

## 7. Tools & Dependencies
Key libraries
- Frontend: React 18, Vite 6, @shopify/polaris, @shopify/app-bridge(-react), react-router-dom v5, axios.
- Backend: Firebase Functions 4, firebase-admin, Koa, koa-router, koa-ejs, @google-cloud/firestore.
- Tooling: Shopify CLI, Firebase Tools, ESLint (Google), Prettier, Babel (functions), Yarn workspaces.

Setup quickstart
- Install dependencies: yarn (root uses workspaces).
- Configure Firebase runtime: packages/functions/.runtimeconfig.json with shopify and app.base_url.
- Configure frontend env: packages/assets/.env.development (VITE_SHOPIFY_API_KEY, Firebase keys).
- Start dev:
  - yarn dev (Shopify CLI dev with proxy and Vite)
  - Optionally: yarn start-dev (assets watch + functions watch) and run Firebase emulators with proper GOOGLE_APPLICATION_CREDENTIALS.
- Build: yarn workspace @avada/assets run production && yarn workspace @avada/functions run production; firebase deploy.

## 8. Other Notes
- Node 20 is required for functions; ensure local runtime matches engines.node.
- Vite alias: use @assets and @functions for cross-package imports; keep paths relative to src roots.
- API endpoints are exposed under /api or /apiSa depending on embed mode; vite.config proxies to backend.
- When adding new API routes:
  - Define in routes/api.js; implement controller; add repository methods as needed; wire via handlers/*.
- When adding new pages:
  - Create under pages/, add a loadable wrapper, and register routes in src/routes/routes.js using routePrefix.
- Firestore queries: use helper functions (paginateQuery, getOrderBy) to maintain consistency.
- For LLM-generated code: adhere to folder conventions, import aliases, and routePrefix handling; keep secrets/env via config; include JSDoc where helpful.