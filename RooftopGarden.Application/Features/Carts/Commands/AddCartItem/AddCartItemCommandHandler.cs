using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Carts.Dtos;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Carts.Commands.AddCartItem;

public class AddCartItemCommandHandler : IRequestHandler<AddCartItemCommand, CartDto>
{
    private readonly IApplicationDbContext _dbContext;

    public AddCartItemCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CartDto> Handle(AddCartItemCommand request, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken)
            ?? throw new NotFoundException("Product", request.ProductId);

        if (!product.CanBeOrdered(request.Quantity))
        {
            throw new BadRequestException("This product is unavailable or does not have enough stock.");
        }

        var cart = await _dbContext.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId, cancellationToken);

        if (cart is null)
        {
            cart = new Cart(request.CustomerId);
            _dbContext.Carts.Add(cart);
        }

        cart.AddOrUpdateItem(request.ProductId, request.Quantity);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return await CartLoader.LoadAsync(_dbContext, request.CustomerId, cancellationToken);
    }
}
