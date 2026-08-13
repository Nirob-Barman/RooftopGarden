using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Products.Dtos;

public record UpdateProductRequest(
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    string? ImageUrl,
    int CategoryId,
    PlantType PlantType,
    SunlightRequirement SunlightRequirement,
    WaterRequirement WaterRequirement);
