using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Orders.Dtos;

namespace RooftopGarden.Application.Features.Orders.Queries.GetAdminOrders;

public class GetAdminOrdersQueryHandler : IRequestHandler<GetAdminOrdersQuery, PagedResult<OrderSummaryDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetAdminOrdersQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<OrderSummaryDto>> Handle(GetAdminOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Orders.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.CustomerId))
        {
            query = query.Where(o => o.CustomerId == request.CustomerId);
        }

        if (request.Status.HasValue)
        {
            query = query.Where(o => o.OrderStatus == request.Status.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize is < 1 or > 100 ? 20 : request.PageSize;

        var orders = await query
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.OrderDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = orders.Select(o => o.ToSummaryDto()).ToList();

        return new PagedResult<OrderSummaryDto>(items, totalCount, pageNumber, pageSize);
    }
}
