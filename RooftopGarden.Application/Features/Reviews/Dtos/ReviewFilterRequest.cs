namespace RooftopGarden.Application.Features.Reviews.Dtos;

public record ReviewFilterRequest(int? ProductId, string? CustomerId, int PageNumber = 1, int PageSize = 20);
