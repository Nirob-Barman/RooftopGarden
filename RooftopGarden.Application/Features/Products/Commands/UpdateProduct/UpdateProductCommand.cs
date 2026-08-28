using MediatR;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Products.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Products.Commands.UpdateProduct;

public record UpdateProductCommand(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    ImageUploadRequest? Image,
    int CategoryId,
    PlantType PlantType,
    SunlightRequirement SunlightRequirement,
    WaterRequirement WaterRequirement) : IRequest<ProductDto>;
