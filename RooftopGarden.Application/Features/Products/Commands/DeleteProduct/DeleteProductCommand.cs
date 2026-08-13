using MediatR;

namespace RooftopGarden.Application.Features.Products.Commands.DeleteProduct;

public record DeleteProductCommand(int Id) : IRequest<Unit>;
