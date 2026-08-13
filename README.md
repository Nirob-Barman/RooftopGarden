# RooftopGarden

Rooftop Garden Management & E-Commerce backend — ASP.NET Core Web API (.NET 8), EF Core 8, SQL Server, ASP.NET Core Identity, and JWT Bearer authentication.

Customers can browse and purchase plants, seeds, pots, soil, fertilizers and gardening tools, and book rooftop gardening services. Admins manage products, orders, bookings, and content.

## Architecture

Clean Architecture, four projects:

- **RooftopGarden.Domain** — entities, enums, domain rules
- **RooftopGarden.Application** — DTOs, interfaces, validators, business services
- **RooftopGarden.Infrastructure** — EF Core `DbContext`, Identity, persistence
- **RooftopGarden.Api** — controllers, middleware, JWT/Swagger configuration

## Running locally

```bash
dotnet restore
dotnet ef database update --project RooftopGarden.Infrastructure --startup-project RooftopGarden.Api
dotnet run --project RooftopGarden.Api
```

Requires local secrets (`dotnet user-secrets`) for `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`, and `ConnectionStrings:DefaultConnection` — see `RooftopGarden.Api`'s user-secrets store.
