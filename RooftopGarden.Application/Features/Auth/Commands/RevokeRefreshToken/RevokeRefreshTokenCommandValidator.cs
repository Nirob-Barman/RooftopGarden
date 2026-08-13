using FluentValidation;

namespace RooftopGarden.Application.Features.Auth.Commands.RevokeRefreshToken;

public class RevokeRefreshTokenCommandValidator : AbstractValidator<RevokeRefreshTokenCommand>
{
    public RevokeRefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty();
    }
}
