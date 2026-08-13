using RooftopGarden.Domain.Common;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Domain.Entities;

public class Booking : BaseEntity
{
    public string CustomerId { get; private set; } = string.Empty;

    public int ServiceId { get; private set; }
    public Service Service { get; private set; } = null!;

    public DateTime BookingDate { get; private set; }
    public TimeSpan PreferredTime { get; private set; }
    public string Address { get; private set; } = string.Empty;
    public string? Notes { get; private set; }
    public BookingStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Booking()
    {
    }

    public Booking(
        string customerId,
        Service service,
        DateTime bookingDate,
        TimeSpan preferredTime,
        string address,
        string? notes = null)
    {
        if (string.IsNullOrWhiteSpace(customerId))
        {
            throw new ArgumentException("CustomerId is required.", nameof(customerId));
        }

        ArgumentNullException.ThrowIfNull(service);

        if (!service.IsActive)
        {
            throw new InvalidOperationException("Cannot book an inactive service.");
        }

        if (bookingDate.Date < DateTime.UtcNow.Date)
        {
            throw new ArgumentException("Booking date cannot be in the past.", nameof(bookingDate));
        }

        if (string.IsNullOrWhiteSpace(address))
        {
            throw new ArgumentException("Address is required.", nameof(address));
        }

        CustomerId = customerId;
        ServiceId = service.Id;
        Service = service;
        BookingDate = bookingDate;
        PreferredTime = preferredTime;
        Address = address;
        Notes = notes;
        Status = BookingStatus.Pending;
        CreatedAt = DateTime.UtcNow;
    }

    public bool CanBeCancelled() => Status is BookingStatus.Pending or BookingStatus.Approved;

    public void Cancel()
    {
        if (!CanBeCancelled())
        {
            throw new InvalidOperationException("This booking is no longer eligible for cancellation.");
        }

        Status = BookingStatus.Cancelled;
    }

    public void Approve()
    {
        if (Status != BookingStatus.Pending)
        {
            throw new InvalidOperationException("Only a pending booking can be approved.");
        }

        Status = BookingStatus.Approved;
    }

    public void Reject()
    {
        if (Status != BookingStatus.Pending)
        {
            throw new InvalidOperationException("Only a pending booking can be rejected.");
        }

        Status = BookingStatus.Rejected;
    }

    public void Complete()
    {
        if (Status != BookingStatus.Approved)
        {
            throw new InvalidOperationException("Only an approved booking can be completed.");
        }

        Status = BookingStatus.Completed;
    }
}
