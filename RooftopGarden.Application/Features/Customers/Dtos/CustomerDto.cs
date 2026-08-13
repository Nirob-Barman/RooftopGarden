namespace RooftopGarden.Application.Features.Customers.Dtos;

public record CustomerDto(string Id, string Email, string FullName, string? PhoneNumber, string? Address, bool IsLockedOut);
