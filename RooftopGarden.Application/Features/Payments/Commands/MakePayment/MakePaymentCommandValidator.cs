using FluentValidation;

namespace RooftopGarden.Application.Features.Payments.Commands.MakePayment;

public class MakePaymentCommandValidator : AbstractValidator<MakePaymentCommand>
{
    public MakePaymentCommandValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty();

        RuleFor(x => x.OrderId)
            .GreaterThan(0);

        RuleFor(x => x.PaymentMethod)
            .IsInEnum();
    }
}
