using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Queries.GetBookingById;

public class GetBookingByIdQueryHandler : IRequestHandler<GetBookingByIdQuery, BookingDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetBookingByIdQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BookingDto> Handle(GetBookingByIdQuery request, CancellationToken cancellationToken)
    {
        var booking = await _dbContext.Bookings
            .Include(b => b.Service)
            .FirstOrDefaultAsync(b => b.Id == request.BookingId && b.CustomerId == request.CustomerId, cancellationToken)
            ?? throw new NotFoundException("Booking", request.BookingId);

        return booking.ToDto();
    }
}
