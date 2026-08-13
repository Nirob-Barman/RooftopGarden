using FluentValidation;

namespace RooftopGarden.Application.Features.Orders.Commands.UpdateOrderStatus;

public class UpdateOrderStatusCommandValidator : AbstractValidator<UpdateOrderStatusCommand>
{
    public UpdateOrderStatusCommandValidator()
    {
        RuleFor(x => x.OrderId)
            .GreaterThan(0);

        RuleFor(x => x.NewStatus)
            .IsInEnum();
    }
}
