using MediatR;
using RooftopGarden.Application.Features.Carts.Dtos;

namespace RooftopGarden.Application.Features.Carts.Queries.GetCart;

public record GetCartQuery(string CustomerId) : IRequest<CartDto>;
