using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Wishlists.Dtos;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Wishlists.Commands.AddWishlistItem;

public class AddWishlistItemCommandHandler : IRequestHandler<AddWishlistItemCommand, WishlistItemDto>
{
    private readonly IApplicationDbContext _dbContext;

    public AddWishlistItemCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<WishlistItemDto> Handle(AddWishlistItemCommand request, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken)
            ?? throw new NotFoundException("Product", request.ProductId);

        var alreadyWishlisted = await _dbContext.Wishlists
            .AnyAsync(w => w.CustomerId == request.CustomerId && w.ProductId == request.ProductId, cancellationToken);

        if (alreadyWishlisted)
        {
            throw new BadRequestException("This product is already in your wishlist.");
        }

        var wishlistItem = new Wishlist(request.CustomerId, request.ProductId);

        _dbContext.Wishlists.Add(wishlistItem);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return wishlistItem.ToDto(product);
    }
}
