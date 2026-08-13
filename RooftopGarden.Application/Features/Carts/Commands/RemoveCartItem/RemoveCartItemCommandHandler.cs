using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Carts.Dtos;

namespace RooftopGarden.Application.Features.Carts.Commands.RemoveCartItem;

public class RemoveCartItemCommandHandler : IRequestHandler<RemoveCartItemCommand, CartDto>
{
    private readonly IApplicationDbContext _dbContext;

    public RemoveCartItemCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CartDto> Handle(RemoveCartItemCommand request, CancellationToken cancellationToken)
    {
        var cart = await _dbContext.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId, cancellationToken)
            ?? throw new NotFoundException("Cart item", request.CartItemId);

        if (!cart.CartItems.Any(ci => ci.Id == request.CartItemId))
        {
            throw new NotFoundException("Cart item", request.CartItemId);
        }

        cart.RemoveItem(request.CartItemId);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await CartLoader.LoadAsync(_dbContext, request.CustomerId, cancellationToken);
    }
}
