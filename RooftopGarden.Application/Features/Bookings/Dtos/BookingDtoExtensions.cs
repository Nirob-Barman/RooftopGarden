using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Bookings.Dtos;

public static class BookingDtoExtensions
{
    public static BookingDto ToDto(this Booking booking) => new(
        booking.Id,
        booking.ServiceId,
        booking.Service.Name,
        booking.BookingDate,
        booking.PreferredTime,
        booking.Address,
        booking.Notes,
        booking.Status.ToString(),
        booking.CreatedAt);
}
