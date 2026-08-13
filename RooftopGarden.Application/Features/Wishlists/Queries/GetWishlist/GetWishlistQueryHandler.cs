using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Wishlists.Dtos;

namespace RooftopGarden.Application.Features.Wishlists.Queries.GetWishlist;

public class GetWishlistQueryHandler : IRequestHandler<GetWishlistQuery, PagedResult<WishlistItemDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetWishlistQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<WishlistItemDto>> Handle(GetWishlistQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Wishlists
            .Include(w => w.Product)
            .Where(w => w.CustomerId == request.CustomerId);

        var totalCount = await query.CountAsync(cancellationToken);

        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize is < 1 or > 100 ? 20 : request.PageSize;

        var items = await query
            .OrderByDescending(w => w.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var dtos = items.Select(w => w.ToDto(w.Product)).ToList();

        return new PagedResult<WishlistItemDto>(dtos, totalCount, pageNumber, pageSize);
    }
}
