namespace RooftopGarden.Application.Features.Bookings.Dtos;

public record BookingDto(
    int Id,
    int ServiceId,
    string ServiceName,
    DateTime BookingDate,
    TimeSpan PreferredTime,
    string Address,
    string? Notes,
    string Status,
    DateTime CreatedAt);
