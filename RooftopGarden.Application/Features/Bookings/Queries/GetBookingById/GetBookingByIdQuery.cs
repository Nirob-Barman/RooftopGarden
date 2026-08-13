using MediatR;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Queries.GetBookingById;

public record GetBookingByIdQuery(string CustomerId, int BookingId) : IRequest<BookingDto>;
