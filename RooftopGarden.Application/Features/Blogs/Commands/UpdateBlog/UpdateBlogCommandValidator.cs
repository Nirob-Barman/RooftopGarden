using FluentValidation;

namespace RooftopGarden.Application.Features.Blogs.Commands.UpdateBlog;

public class UpdateBlogCommandValidator : AbstractValidator<UpdateBlogCommand>
{
    public UpdateBlogCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(300);

        RuleFor(x => x.Content)
            .NotEmpty();

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500);
    }
}
