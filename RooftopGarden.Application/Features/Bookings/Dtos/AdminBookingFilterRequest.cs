using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Bookings.Dtos;

public record AdminBookingFilterRequest(
    string? CustomerId,
    int? ServiceId,
    BookingStatus? Status,
    int PageNumber = 1,
    int PageSize = 20);
