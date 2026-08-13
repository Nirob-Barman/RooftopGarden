namespace RooftopGarden.Application.Features.Products.Dtos;

public record ProductDto(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    string? ImageUrl,
    int CategoryId,
    string CategoryName,
    string PlantType,
    string SunlightRequirement,
    string WaterRequirement,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
