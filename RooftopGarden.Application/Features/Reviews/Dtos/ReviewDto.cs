namespace RooftopGarden.Application.Features.Reviews.Dtos;

public record ReviewDto(int Id, int ProductId, string CustomerId, int Rating, string? Comment, DateTime CreatedAt);
