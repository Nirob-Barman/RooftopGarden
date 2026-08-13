using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Bookings.Dtos;

namespace RooftopGarden.Application.Features.Bookings.Queries.GetBookings;

public record GetBookingsQuery(string CustomerId, int PageNumber, int PageSize) : IRequest<PagedResult<BookingDto>>;
