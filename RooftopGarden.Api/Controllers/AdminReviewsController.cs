using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Features.Reviews.Commands.AdminDeleteReview;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/admin/reviews")]
[Authorize(Roles = Roles.Admin)]
public class AdminReviewsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminReviewsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteReview(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new AdminDeleteReviewCommand(id), cancellationToken);
        return NoContent();
    }
}
