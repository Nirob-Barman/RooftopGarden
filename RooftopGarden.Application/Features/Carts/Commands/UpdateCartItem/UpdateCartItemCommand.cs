using MediatR;
using RooftopGarden.Application.Features.Carts.Dtos;

namespace RooftopGarden.Application.Features.Carts.Commands.UpdateCartItem;

public record UpdateCartItemCommand(string CustomerId, int CartItemId, int Quantity) : IRequest<CartDto>;
