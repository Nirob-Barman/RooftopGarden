using MediatR;
using RooftopGarden.Application.Features.Auth.Dtos;

namespace RooftopGarden.Application.Features.Auth.Queries.GetProfile;

public record GetProfileQuery(string UserId) : IRequest<ProfileDto>;
