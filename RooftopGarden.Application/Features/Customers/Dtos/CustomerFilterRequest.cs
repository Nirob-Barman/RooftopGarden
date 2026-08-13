namespace RooftopGarden.Application.Features.Customers.Dtos;

public record CustomerFilterRequest(string? Search, int PageNumber = 1, int PageSize = 20);
