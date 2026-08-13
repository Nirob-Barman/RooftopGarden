using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Customers.Commands.LockCustomer;
using RooftopGarden.Application.Features.Customers.Commands.UnlockCustomer;
using RooftopGarden.Application.Features.Customers.Dtos;
using RooftopGarden.Application.Features.Customers.Queries.GetCustomerById;
using RooftopGarden.Application.Features.Customers.Queries.GetCustomers;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = Roles.Admin)]
public class AdminCustomersController : ControllerBase
{
    private readonly ISender _sender;

    public AdminCustomersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<CustomerDto>>> GetCustomers(
        [FromQuery] CustomerFilterRequest filter,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCustomersQuery(filter.Search, filter.PageNumber, filter.PageSize), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDto>> GetCustomerById(string id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCustomerByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id}/lock")]
    public async Task<ActionResult<CustomerDto>> LockCustomer(string id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new LockCustomerCommand(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id}/unlock")]
    public async Task<ActionResult<CustomerDto>> UnlockCustomer(string id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new UnlockCustomerCommand(id), cancellationToken);
        return Ok(result);
    }
}
