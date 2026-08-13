using MediatR;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Queries.GetAdminBookingById;

public record GetAdminBookingByIdQuery(int BookingId) : IRequest<BookingDto>;
