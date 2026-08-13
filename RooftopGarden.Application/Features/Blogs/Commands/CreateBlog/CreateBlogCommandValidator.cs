using FluentValidation;

namespace RooftopGarden.Application.Features.Blogs.Commands.CreateBlog;

public class CreateBlogCommandValidator : AbstractValidator<CreateBlogCommand>
{
    public CreateBlogCommandValidator()
    {
        RuleFor(x => x.AuthorId)
            .NotEmpty();

        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(300);

        RuleFor(x => x.Content)
            .NotEmpty();

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500);
    }
}
