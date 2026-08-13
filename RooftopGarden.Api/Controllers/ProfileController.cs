using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Api.Extensions;
using RooftopGarden.Application.Features.Auth.Commands.UpdateProfile;
using RooftopGarden.Application.Features.Auth.Dtos;
using RooftopGarden.Application.Features.Auth.Queries.GetProfile;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly ISender _sender;

    public ProfileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<ProfileDto>> GetProfile(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetProfileQuery(User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPut]
    public async Task<ActionResult<ProfileDto>> UpdateProfile([FromBody] UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateProfileCommand(User.GetUserId(), request.FullName, request.PhoneNumber, request.Address, request.ProfileImageUrl);
        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }
}
