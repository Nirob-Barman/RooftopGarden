namespace RooftopGarden.Application.Common.Models.Identity;

public record IssuedRefreshToken(string RawToken, DateTime ExpiresAt);
