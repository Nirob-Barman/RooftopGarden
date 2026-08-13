using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Api.Extensions;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Reviews.Commands.CreateReview;
using RooftopGarden.Application.Features.Reviews.Commands.DeleteReview;
using RooftopGarden.Application.Features.Reviews.Commands.UpdateReview;
using RooftopGarden.Application.Features.Reviews.Dtos;
using RooftopGarden.Application.Features.Reviews.Queries.GetReviewById;
using RooftopGarden.Application.Features.Reviews.Queries.GetReviews;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly ISender _sender;

    public ReviewsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<ReviewDto>>> GetReviews(
        [FromQuery] ReviewFilterRequest filter,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetReviewsQuery(filter.ProductId, filter.CustomerId, filter.PageNumber, filter.PageSize),
            cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ReviewDto>> GetReviewById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetReviewByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = Roles.Customer)]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateReviewCommand(User.GetUserId(), request.ProductId, request.Rating, request.Comment);
        var result = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetReviewById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Customer)]
    public async Task<ActionResult<ReviewDto>> UpdateReview(
        int id,
        [FromBody] UpdateReviewRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateReviewCommand(User.GetUserId(), id, request.Rating, request.Comment);
        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Customer)]
    public async Task<IActionResult> DeleteReview(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteReviewCommand(User.GetUserId(), id), cancellationToken);
        return NoContent();
    }
}
