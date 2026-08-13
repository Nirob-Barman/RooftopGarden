using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;

namespace RooftopGarden.Application.Features.Wishlists.Commands.RemoveWishlistItem;

public class RemoveWishlistItemCommandHandler : IRequestHandler<RemoveWishlistItemCommand, Unit>
{
    private readonly IApplicationDbContext _dbContext;

    public RemoveWishlistItemCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Unit> Handle(RemoveWishlistItemCommand request, CancellationToken cancellationToken)
    {
        var wishlistItem = await _dbContext.Wishlists
            .FirstOrDefaultAsync(w => w.CustomerId == request.CustomerId && w.ProductId == request.ProductId, cancellationToken)
            ?? throw new NotFoundException("Wishlist item", request.ProductId);

        _dbContext.Wishlists.Remove(wishlistItem);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
