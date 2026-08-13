namespace RooftopGarden.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(string userId, string email, string fullName, IEnumerable<string> roles);
}
