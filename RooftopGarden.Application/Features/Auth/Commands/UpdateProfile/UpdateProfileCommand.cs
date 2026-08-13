using MediatR;
using RooftopGarden.Application.Features.Auth.Dtos;

namespace RooftopGarden.Application.Features.Auth.Commands.UpdateProfile;

public record UpdateProfileCommand(string UserId, string FullName, string? PhoneNumber, string? Address, string? ProfileImageUrl) : IRequest<ProfileDto>;
