using FluentValidation;

namespace RooftopGarden.Application.Features.Bookings.Commands.CreateBooking;

public class CreateBookingCommandValidator : AbstractValidator<CreateBookingCommand>
{
    public CreateBookingCommandValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty();

        RuleFor(x => x.ServiceId)
            .GreaterThan(0);

        RuleFor(x => x.BookingDate)
            .Must(date => date.Date >= DateTime.UtcNow.Date)
            .WithMessage("Booking date cannot be in the past.");

        RuleFor(x => x.Address)
            .NotEmpty()
            .MaximumLength(500);

        RuleFor(x => x.Notes)
            .MaximumLength(1000);
    }
}
