using MediatR;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Commands.RejectBooking;

public record RejectBookingCommand(int BookingId) : IRequest<BookingDto>;
