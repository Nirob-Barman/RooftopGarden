namespace RooftopGarden.Application.Features.Services.Dtos;

public record UpdateServiceRequest(string Name, string? Description, decimal Price, TimeSpan Duration, string? ImageUrl);
