namespace RooftopGarden.Application.Features.Bookings.Dtos;

public record CreateBookingRequest(int ServiceId, DateTime BookingDate, TimeSpan PreferredTime, string Address, string? Notes);
