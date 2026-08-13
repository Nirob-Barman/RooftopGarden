using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Products.Dtos;

public static class ProductDtoExtensions
{
    public static ProductDto ToDto(this Product product, string categoryName) => new(
        product.Id,
        product.Name,
        product.Description,
        product.Price,
        product.StockQuantity,
        product.ImageUrl,
        product.CategoryId,
        categoryName,
        product.PlantType.ToString(),
        product.SunlightRequirement.ToString(),
        product.WaterRequirement.ToString(),
        product.IsActive,
        product.CreatedAt,
        product.UpdatedAt);
}
