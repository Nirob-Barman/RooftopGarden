using MediatR;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Commands.ApproveBooking;

public record ApproveBookingCommand(int BookingId) : IRequest<BookingDto>;
