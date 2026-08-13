using FluentValidation;

namespace RooftopGarden.Application.Features.Wishlists.Commands.AddWishlistItem;

public class AddWishlistItemCommandValidator : AbstractValidator<AddWishlistItemCommand>
{
    public AddWishlistItemCommandValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty();

        RuleFor(x => x.ProductId)
            .GreaterThan(0);
    }
}
