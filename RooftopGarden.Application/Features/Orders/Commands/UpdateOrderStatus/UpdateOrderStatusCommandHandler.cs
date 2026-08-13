using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Orders.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Orders.Commands.UpdateOrderStatus;

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, OrderDto>
{
    private readonly IApplicationDbContext _dbContext;

    public UpdateOrderStatusCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OrderDto> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken)
            ?? throw new NotFoundException("Order", request.OrderId);

        order.UpdateStatus(request.NewStatus);

        if (request.NewStatus == OrderStatus.Cancelled)
        {
            foreach (var item in order.OrderItems)
            {
                item.Product.IncreaseStock(item.Quantity);
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return order.ToDto();
    }
}
