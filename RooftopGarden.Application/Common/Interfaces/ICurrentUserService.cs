namespace RooftopGarden.Application.Common.Interfaces;

public interface ICurrentUserService
{
    bool IsAuthenticated { get; }
    string? UserId { get; }
    string? UserName { get; }
    bool IsInRole(string role);
}
