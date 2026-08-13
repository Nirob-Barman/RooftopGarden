using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Products.Commands.CreateProduct;
using RooftopGarden.Application.Features.Products.Commands.DeleteProduct;
using RooftopGarden.Application.Features.Products.Commands.UpdateProduct;
using RooftopGarden.Application.Features.Products.Dtos;
using RooftopGarden.Application.Features.Products.Queries.GetProductById;
using RooftopGarden.Application.Features.Products.Queries.GetProducts;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = Roles.Admin)]
public class AdminProductsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminProductsController(ISender sender)
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
            IncludeInactive: true,
            filter.PageNumber,
            filter.PageSize);

        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProductById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetProductByIdQuery(id, IncludeInactive: true), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetProductById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(
        int id,
        [FromBody] UpdateProductRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateProductCommand(
            id,
            request.Name,
            request.Description,
            request.Price,
            request.StockQuantity,
            request.ImageUrl,
            request.CategoryId,
            request.PlantType,
            request.SunlightRequirement,
            request.WaterRequirement);

        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteProductCommand(id), cancellationToken);
        return NoContent();
    }
}
