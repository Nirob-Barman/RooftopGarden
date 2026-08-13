using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Features.Auth.Commands.Login;
using RooftopGarden.Application.Features.Auth.Commands.RefreshToken;
using RooftopGarden.Application.Features.Auth.Commands.Register;
using RooftopGarden.Application.Features.Auth.Commands.RevokeRefreshToken;
using RooftopGarden.Application.Features.Auth.Dtos;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const string RefreshTokenCookieName = "refreshToken";
    private const string RefreshTokenCookiePath = "/api/auth";

    private readonly ISender _sender;

    public AuthController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        AppendRefreshTokenCookie(result);
        return Ok(result);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        AppendRefreshTokenCookie(result);
        return Ok(result);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Refresh(CancellationToken cancellationToken)
    {
        var refreshToken = Request.Cookies[RefreshTokenCookieName];
        if (string.IsNullOrEmpty(refreshToken))
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        var result = await _sender.Send(new RefreshTokenCommand(refreshToken), cancellationToken);
        AppendRefreshTokenCookie(result);
        return Ok(result);
    }

    [HttpPost("revoke")]
    [AllowAnonymous]
    public async Task<IActionResult> Revoke(CancellationToken cancellationToken)
    {
        var refreshToken = Request.Cookies[RefreshTokenCookieName];
        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _sender.Send(new RevokeRefreshTokenCommand(refreshToken), cancellationToken);
        }

        Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions { Path = RefreshTokenCookiePath });
        return NoContent();
    }

    private void AppendRefreshTokenCookie(AuthResponseDto result)
    {
        Response.Cookies.Append(RefreshTokenCookieName, result.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = RefreshTokenCookiePath,
            Expires = result.RefreshTokenExpiresAt,
        });
    }
}
