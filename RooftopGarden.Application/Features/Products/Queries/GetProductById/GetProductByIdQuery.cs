using MediatR;
using RooftopGarden.Application.Features.Products.Dtos;

namespace RooftopGarden.Application.Features.Products.Queries.GetProductById;

public record GetProductByIdQuery(int Id, bool IncludeInactive) : IRequest<ProductDto>;
