using MediatR;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Commands.CancelBooking;

public record CancelBookingCommand(string CustomerId, int BookingId) : IRequest<BookingDto>;
