namespace RooftopGarden.Application.Features.Reviews.Dtos;

public record CreateReviewRequest(int ProductId, int Rating, string? Comment);
