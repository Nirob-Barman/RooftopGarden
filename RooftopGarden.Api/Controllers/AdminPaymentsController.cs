using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Payments.Commands.RefundPayment;
using RooftopGarden.Application.Features.Payments.Dtos;
using RooftopGarden.Application.Features.Payments.Queries.GetAdminPaymentById;
using RooftopGarden.Application.Features.Payments.Queries.GetAdminPayments;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/admin/payments")]
[Authorize(Roles = Roles.Admin)]
public class AdminPaymentsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminPaymentsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<PaymentDto>>> GetPayments(
        [FromQuery] AdminPaymentFilterRequest filter,
        CancellationToken cancellationToken)
    {
        var query = new GetAdminPaymentsQuery(filter.CustomerId, filter.Status, filter.PageNumber, filter.PageSize);
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PaymentDto>> GetPaymentById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAdminPaymentByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id:int}/refund")]
    public async Task<ActionResult<PaymentDto>> RefundPayment(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new RefundPaymentCommand(id), cancellationToken);
        return Ok(result);
    }
}
