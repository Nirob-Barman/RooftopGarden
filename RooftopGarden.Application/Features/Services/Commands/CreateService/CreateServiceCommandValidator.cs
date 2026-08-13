using FluentValidation;

namespace RooftopGarden.Application.Features.Services.Commands.CreateService;

public class CreateServiceCommandValidator : AbstractValidator<CreateServiceCommand>
{
    public CreateServiceCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Duration)
            .GreaterThan(TimeSpan.Zero);

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500);
    }
}
