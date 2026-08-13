using System.Text.Json.Serialization;

namespace RooftopGarden.Application.Features.Auth.Dtos;

public record AuthResponseDto(
    string AccessToken,
    DateTime AccessTokenExpiresAt,
    [property: JsonIgnore] string RefreshToken,
    [property: JsonIgnore] DateTime RefreshTokenExpiresAt,
    string Email,
    string FullName,
    string Role);
