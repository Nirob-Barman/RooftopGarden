using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Wishlists.Dtos;

namespace RooftopGarden.Application.Features.Wishlists.Queries.GetWishlist;

public record GetWishlistQuery(string CustomerId, int PageNumber, int PageSize) : IRequest<PagedResult<WishlistItemDto>>;
