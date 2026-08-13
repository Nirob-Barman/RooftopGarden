using MediatR;
using RooftopGarden.Application.Features.Carts.Dtos;

namespace RooftopGarden.Application.Features.Carts.Commands.RemoveCartItem;

public record RemoveCartItemCommand(string CustomerId, int CartItemId) : IRequest<CartDto>;
