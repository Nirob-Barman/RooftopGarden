namespace RooftopGarden.Application.Features.Services.Dtos;

public record ServiceDto(int Id, string Name, string? Description, decimal Price, TimeSpan Duration, string? ImageUrl, bool IsActive);
