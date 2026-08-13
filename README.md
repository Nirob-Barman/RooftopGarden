# RooftopGarden

Rooftop Garden Management & E-Commerce backend — ASP.NET Core Web API (.NET 8), EF Core 8, SQL Server, ASP.NET Core Identity, JWT Bearer authentication with refresh-token rotation, and CQRS via MediatR.

Customers can browse and purchase plants, seeds, pots, soil, fertilizers and gardening tools, and book rooftop gardening services. Admins manage products, categories, orders, payments, and content.

## Architecture

Clean Architecture, four projects:

- **RooftopGarden.Domain** — DDD entities, enums, domain rules (no dependencies on the other projects)
- **RooftopGarden.Application** — CQRS Commands/Queries + Handlers (MediatR), DTOs, FluentValidation validators, interfaces
- **RooftopGarden.Infrastructure** — EF Core `DbContext`, Identity, JWT/refresh-token implementation, persistence
- **RooftopGarden.Api** — controllers (thin, `ISender`-only), global exception handling, JWT/Swagger configuration

Request flow: `Controller → MediatR (ISender) → Command/Query Handler → Application → Infrastructure/EF Core`

## Features implemented so far

- **Auth** — register, login, JWT access + refresh tokens (rotation and revoke), refresh token stored in an httpOnly cookie (never exposed in the JSON response), profile view/update
- **Catalog** — categories and products, public browsing (search/filter/paginate) split from admin management
- **Cart** — add/update/remove items, with server-side stock and availability checks
- **Orders** — checkout from cart, order history/detail, cancellation, admin status management
- **Payments** — simulated payment capture, automatic refund on order cancellation, admin-initiated refund
- **Reviews** — purchase-verified reviews (rating 1-5), public read, admin moderation
- **Wishlist** — add/remove products, no admin surface (purely customer-facing)
- **Rooftop Gardening Services** — public browsing + admin CRUD on the same route, visibility derived from the caller's role
- **Bookings** — book a service, cancel eligible bookings, admin approve/reject and filter by status
- **Blog** — public read, admin create/update/delete (any admin, not author-scoped)
- **Admin Dashboard** — customer/product/order/booking/service counts, orders/bookings broken down by status, revenue (paid payments only)

All `CLAUDE.md` backend features are now implemented.

## Frontend

A React (Vite + TypeScript) client lives alongside this API in `RooftopGarden.Web/`. Redux Toolkit + RTK Query for state/data-fetching, React Router, Tailwind CSS (green/earthy design system), React Hook Form + Zod for forms. Every backend feature above has a corresponding page — customer-facing browsing/checkout/booking flows plus the matching admin management screens. See `RooftopGarden.Web/` for its own setup.

## Running locally

```bash
dotnet restore
dotnet ef database update --project RooftopGarden.Infrastructure --startup-project RooftopGarden.Api
dotnet run --project RooftopGarden.Api
```

Requires local secrets (`dotnet user-secrets`) for `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpiryMinutes`, and `ConnectionStrings:DefaultConnection` — see `RooftopGarden.Api`'s user-secrets store.

Swagger UI is served at `/swagger` in Development, with JWT Bearer auth wired in — log in via `/api/auth/login` and paste the returned access token in to test protected endpoints.

A seeded Admin account (`admin@rooftopgarden.com` / `Admin@123`) is created automatically on first run. This is a fixed development password — change it before any non-local use.
