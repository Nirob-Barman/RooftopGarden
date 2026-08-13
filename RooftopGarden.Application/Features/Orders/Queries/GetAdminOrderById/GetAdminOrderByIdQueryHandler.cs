using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Orders.Dtos;

namespace RooftopGarden.Application.Features.Orders.Queries.GetAdminOrderById;

public class GetAdminOrderByIdQueryHandler : IRequestHandler<GetAdminOrderByIdQuery, OrderDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetAdminOrderByIdQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OrderDto> Handle(GetAdminOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken)
            ?? throw new NotFoundException("Order", request.OrderId);

        return order.ToDto();
    }
}
