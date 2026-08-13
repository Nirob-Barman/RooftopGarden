using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Products.Dtos;
using RooftopGarden.Application.Features.Products.Queries.GetProductById;
using RooftopGarden.Application.Features.Products.Queries.GetProducts;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/products")]
[AllowAnonymous]
public class ProductsController : ControllerBase
{
    private readonly ISender _sender;

    public ProductsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts(
        [FromQuery] ProductFilterRequest filter,
        CancellationToken cancellationToken)
    {
        var query = new GetProductsQuery(
            filter.Search,
            filter.CategoryId,
            filter.MinPrice,
            filter.MaxPrice,
            filter.InStockOnly,
            IncludeInactive: false,
            filter.PageNumber,
            filter.PageSize);

        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProductById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetProductByIdQuery(id, IncludeInactive: false), cancellationToken);
        return Ok(result);
    }
}
