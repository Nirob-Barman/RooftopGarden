using MediatR;

namespace RooftopGarden.Application.Features.Products.Commands.ActivateProduct;

public record ActivateProductCommand(int Id) : IRequest<Unit>;
