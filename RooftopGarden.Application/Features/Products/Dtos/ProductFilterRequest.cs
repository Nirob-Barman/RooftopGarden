namespace RooftopGarden.Application.Features.Products.Dtos;

public record ProductFilterRequest(
    string? Search,
    int? CategoryId,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool? InStockOnly,
    int PageNumber = 1,
    int PageSize = 20);
