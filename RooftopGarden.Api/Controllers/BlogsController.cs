using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Api.Extensions;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Blogs.Commands.CreateBlog;
using RooftopGarden.Application.Features.Blogs.Commands.DeleteBlog;
using RooftopGarden.Application.Features.Blogs.Commands.UpdateBlog;
using RooftopGarden.Application.Features.Blogs.Dtos;
using RooftopGarden.Application.Features.Blogs.Queries.GetBlogById;
using RooftopGarden.Application.Features.Blogs.Queries.GetBlogs;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/blogs")]
public class BlogsController : ControllerBase
{
    private readonly ISender _sender;

    public BlogsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<BlogDto>>> GetBlogs(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetBlogsQuery(pageNumber, pageSize), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<BlogDto>> GetBlogById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetBlogByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<BlogDto>> CreateBlog([FromBody] CreateBlogRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateBlogCommand(User.GetUserId(), request.Title, request.Content, request.ImageUrl);
        var result = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetBlogById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<BlogDto>> UpdateBlog(int id, [FromBody] UpdateBlogRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateBlogCommand(id, request.Title, request.Content, request.ImageUrl);
        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> DeleteBlog(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteBlogCommand(id), cancellationToken);
        return NoContent();
    }
}
