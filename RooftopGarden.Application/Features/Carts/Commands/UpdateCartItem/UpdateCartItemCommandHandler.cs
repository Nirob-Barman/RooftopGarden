using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Carts.Dtos;

namespace RooftopGarden.Application.Features.Carts.Commands.UpdateCartItem;

public class UpdateCartItemCommandHandler : IRequestHandler<UpdateCartItemCommand, CartDto>
{
    private readonly IApplicationDbContext _dbContext;

    public UpdateCartItemCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CartDto> Handle(UpdateCartItemCommand request, CancellationToken cancellationToken)
    {
        var cart = await _dbContext.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId, cancellationToken)
            ?? throw new NotFoundException("Cart item", request.CartItemId);

        var item = cart.CartItems.FirstOrDefault(ci => ci.Id == request.CartItemId)
            ?? throw new NotFoundException("Cart item", request.CartItemId);

        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId, cancellationToken);
        if (product is not null && !product.CanBeOrdered(request.Quantity))
        {
            throw new BadRequestException("This product is unavailable or does not have enough stock.");
        }

        cart.UpdateItemQuantity(request.CartItemId, request.Quantity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await CartLoader.LoadAsync(_dbContext, request.CustomerId, cancellationToken);
    }
}
