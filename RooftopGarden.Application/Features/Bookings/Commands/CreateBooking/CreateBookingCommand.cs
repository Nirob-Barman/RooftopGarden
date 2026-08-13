using MediatR;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Commands.CreateBooking;

public record CreateBookingCommand(
    string CustomerId,
    int ServiceId,
    DateTime BookingDate,
    TimeSpan PreferredTime,
    string Address,
    string? Notes) : IRequest<BookingDto>;
