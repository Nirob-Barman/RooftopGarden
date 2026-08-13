using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Bookings.Dtos;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Bookings.Commands.CreateBooking;

public class CreateBookingCommandHandler : IRequestHandler<CreateBookingCommand, BookingDto>
{
    private readonly IApplicationDbContext _dbContext;

    public CreateBookingCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BookingDto> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
    {
        var service = await _dbContext.Services.FirstOrDefaultAsync(s => s.Id == request.ServiceId, cancellationToken)
            ?? throw new NotFoundException("Service", request.ServiceId);

        var booking = new Booking(
            request.CustomerId,
            service,
            request.BookingDate,
            request.PreferredTime,
            request.Address,
            request.Notes);

        _dbContext.Bookings.Add(booking);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return booking.ToDto();
    }
}
