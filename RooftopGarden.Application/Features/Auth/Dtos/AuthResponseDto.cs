namespace RooftopGarden.Application.Features.Auth.Dtos;

public record AuthResponseDto(
    string AccessToken,
    DateTime AccessTokenExpiresAt,
    string RefreshToken,
    string Email,
    string FullName,
    string Role);
