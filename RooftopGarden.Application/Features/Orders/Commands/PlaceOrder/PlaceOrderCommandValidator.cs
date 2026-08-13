using FluentValidation;

namespace RooftopGarden.Application.Features.Orders.Commands.PlaceOrder;

public class PlaceOrderCommandValidator : AbstractValidator<PlaceOrderCommand>
{
    public PlaceOrderCommandValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty();

        RuleFor(x => x.ShippingAddress)
            .NotEmpty()
            .MaximumLength(500);
    }
}
