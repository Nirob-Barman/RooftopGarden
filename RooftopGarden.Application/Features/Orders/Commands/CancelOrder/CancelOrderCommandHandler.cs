using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Orders.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Orders.Commands.CancelOrder;

public class CancelOrderCommandHandler : IRequestHandler<CancelOrderCommand, OrderDto>
{
    private readonly IApplicationDbContext _dbContext;

    public CancelOrderCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OrderDto> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.CustomerId == request.CustomerId, cancellationToken)
            ?? throw new NotFoundException("Order", request.OrderId);

        order.Cancel();

        foreach (var item in order.OrderItems)
        {
            item.Product.IncreaseStock(item.Quantity);
        }

        if (order.Payment is { PaymentStatus: PaymentStatus.Paid })
        {
            order.Payment.Refund();
            order.MarkPaymentStatus(PaymentStatus.Refunded);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return order.ToDto();
    }
}
