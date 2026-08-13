using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Commands.RejectBooking;

public class RejectBookingCommandHandler : IRequestHandler<RejectBookingCommand, BookingDto>
{
    private readonly IApplicationDbContext _dbContext;

    public RejectBookingCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BookingDto> Handle(RejectBookingCommand request, CancellationToken cancellationToken)
    {
        var booking = await _dbContext.Bookings
            .Include(b => b.Service)
            .FirstOrDefaultAsync(b => b.Id == request.BookingId, cancellationToken)
            ?? throw new NotFoundException("Booking", request.BookingId);

        booking.Reject();
        await _dbContext.SaveChangesAsync(cancellationToken);

        return booking.ToDto();
    }
}
