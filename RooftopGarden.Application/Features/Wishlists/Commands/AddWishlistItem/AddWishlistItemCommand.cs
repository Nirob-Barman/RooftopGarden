using MediatR;
using RooftopGarden.Application.Features.Wishlists.Dtos;

namespace RooftopGarden.Application.Features.Wishlists.Commands.AddWishlistItem;

public record AddWishlistItemCommand(string CustomerId, int ProductId) : IRequest<WishlistItemDto>;
