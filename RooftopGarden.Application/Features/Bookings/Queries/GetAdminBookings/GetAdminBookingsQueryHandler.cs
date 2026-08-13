using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Queries.GetAdminBookings;

public class GetAdminBookingsQueryHandler : IRequestHandler<GetAdminBookingsQuery, PagedResult<BookingDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetAdminBookingsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<BookingDto>> Handle(GetAdminBookingsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Bookings.Include(b => b.Service).AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.CustomerId))
        {
            query = query.Where(b => b.CustomerId == request.CustomerId);
        }

        if (request.ServiceId.HasValue)
        {
            query = query.Where(b => b.ServiceId == request.ServiceId.Value);
        }

        if (request.Status.HasValue)
        {
            query = query.Where(b => b.Status == request.Status.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize is < 1 or > 100 ? 20 : request.PageSize;

        var bookings = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = bookings.Select(b => b.ToDto()).ToList();

        return new PagedResult<BookingDto>(items, totalCount, pageNumber, pageSize);
    }
}
