using RooftopGarden.Application.Common.Models.Identity;

namespace RooftopGarden.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    AccessToken GenerateToken(string userId, string email, string fullName, string role);
}
