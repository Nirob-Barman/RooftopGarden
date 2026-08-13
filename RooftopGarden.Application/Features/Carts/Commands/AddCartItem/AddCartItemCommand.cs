using MediatR;
using RooftopGarden.Application.Features.Carts.Dtos;

namespace RooftopGarden.Application.Features.Carts.Commands.AddCartItem;

public record AddCartItemCommand(string CustomerId, int ProductId, int Quantity) : IRequest<CartDto>;
