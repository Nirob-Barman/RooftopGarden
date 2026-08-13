using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Orders.Dtos;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Orders.Commands.PlaceOrder;

public class PlaceOrderCommandHandler : IRequestHandler<PlaceOrderCommand, OrderDto>
{
    private readonly IApplicationDbContext _dbContext;

    public PlaceOrderCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OrderDto> Handle(PlaceOrderCommand request, CancellationToken cancellationToken)
    {
        var cart = await _dbContext.Carts
            .Include(c => c.CartItems).ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId, cancellationToken);

        if (cart is null || cart.CartItems.Count == 0)
        {
            throw new BadRequestException("Your cart is empty.");
        }

        foreach (var cartItem in cart.CartItems)
        {
            if (!cartItem.Product.CanBeOrdered(cartItem.Quantity))
            {
                throw new BadRequestException($"'{cartItem.Product.Name}' is unavailable or does not have enough stock.");
            }
        }

        var order = new Order(request.CustomerId, request.ShippingAddress);

        foreach (var cartItem in cart.CartItems)
        {
            order.AddItem(cartItem.ProductId, cartItem.Quantity, cartItem.Product.Price);
            cartItem.Product.DecreaseStock(cartItem.Quantity);
        }

        _dbContext.Orders.Add(order);
        cart.Clear();

        await _dbContext.SaveChangesAsync(cancellationToken);

        var persisted = await _dbContext.Orders
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .FirstAsync(o => o.Id == order.Id, cancellationToken);

        return persisted.ToDto();
    }
}
