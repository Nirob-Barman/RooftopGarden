using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Products.Dtos;

namespace RooftopGarden.Application.Features.Products.Queries.GetProducts;

public record GetProductsQuery(
    string? Search,
    int? CategoryId,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool? InStockOnly,
    bool IncludeInactive,
    int PageNumber,
    int PageSize) : IRequest<PagedResult<ProductDto>>;
