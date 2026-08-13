using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Queries.GetBookings;

public class GetBookingsQueryHandler : IRequestHandler<GetBookingsQuery, PagedResult<BookingDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetBookingsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<BookingDto>> Handle(GetBookingsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Bookings
            .Include(b => b.Service)
            .Where(b => b.CustomerId == request.CustomerId);

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
