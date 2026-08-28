using FluentValidation;

namespace RooftopGarden.Application.Features.Products.Commands.UpdateProduct;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0);

        //RuleFor(x => x.ImageUrl)
        //    .MaximumLength(500);

        RuleFor(x => x.CategoryId)
            .GreaterThan(0);

        RuleFor(x => x.PlantType)
            .IsInEnum();

        RuleFor(x => x.SunlightRequirement)
            .IsInEnum();

        RuleFor(x => x.WaterRequirement)
            .IsInEnum();
    }
}
