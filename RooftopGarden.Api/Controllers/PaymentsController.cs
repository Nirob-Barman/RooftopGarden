using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Api.Extensions;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Payments.Commands.MakePayment;
using RooftopGarden.Application.Features.Payments.Dtos;
using RooftopGarden.Application.Features.Payments.Queries.GetPaymentById;
using RooftopGarden.Application.Features.Payments.Queries.GetPayments;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize(Roles = Roles.Customer)]
public class PaymentsController : ControllerBase
{
    private readonly ISender _sender;

    public PaymentsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost]
    public async Task<ActionResult<PaymentDto>> MakePayment([FromBody] MakePaymentRequest request, CancellationToken cancellationToken)
    {
        var command = new MakePaymentCommand(User.GetUserId(), request.OrderId, request.PaymentMethod);
        var result = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetPaymentById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<PaymentDto>>> GetPayments(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetPaymentsQuery(User.GetUserId(), pageNumber, pageSize), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PaymentDto>> GetPaymentById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetPaymentByIdQuery(User.GetUserId(), id), cancellationToken);
        return Ok(result);
    }
}
