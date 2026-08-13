using MediatR;

namespace RooftopGarden.Application.Features.Wishlists.Commands.RemoveWishlistItem;

public record RemoveWishlistItemCommand(string CustomerId, int ProductId) : IRequest<Unit>;
