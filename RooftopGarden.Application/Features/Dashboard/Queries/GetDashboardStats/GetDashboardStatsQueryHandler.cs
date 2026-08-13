using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Dashboard.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Dashboard.Queries.GetDashboardStats;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IIdentityService _identityService;

    public GetDashboardStatsQueryHandler(IApplicationDbContext dbContext, IIdentityService identityService)
    {
        _dbContext = dbContext;
        _identityService = identityService;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var totalCustomers = await _identityService.GetCustomerCountAsync();

        var totalProducts = await _dbContext.Products.CountAsync(cancellationToken);
        var activeProducts = await _dbContext.Products.CountAsync(p => p.IsActive, cancellationToken);

        var totalOrders = await _dbContext.Orders.CountAsync(cancellationToken);

        var totalRevenue = await _dbContext.Payments
            .Where(p => p.PaymentStatus == PaymentStatus.Paid)
            .SumAsync(p => p.Amount, cancellationToken);

        var ordersByStatus = await _dbContext.Orders
            .GroupBy(o => o.OrderStatus)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var totalBookings = await _dbContext.Bookings.CountAsync(cancellationToken);

        var bookingsByStatus = await _dbContext.Bookings
            .GroupBy(b => b.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var totalServices = await _dbContext.Services.CountAsync(cancellationToken);
        var activeServices = await _dbContext.Services.CountAsync(s => s.IsActive, cancellationToken);

        return new DashboardStatsDto(
            totalCustomers,
            totalProducts,
            activeProducts,
            totalOrders,
            totalRevenue,
            ordersByStatus.ToDictionary(x => x.Status.ToString(), x => x.Count),
            totalBookings,
            bookingsByStatus.ToDictionary(x => x.Status.ToString(), x => x.Count),
            totalServices,
            activeServices);
    }
}
