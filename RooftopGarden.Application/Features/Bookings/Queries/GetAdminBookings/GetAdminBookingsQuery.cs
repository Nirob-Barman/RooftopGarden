using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Bookings.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Bookings.Queries.GetAdminBookings;

public record GetAdminBookingsQuery(
    string? CustomerId,
    int? ServiceId,
    BookingStatus? Status,
    int PageNumber,
    int PageSize) : IRequest<PagedResult<BookingDto>>;
