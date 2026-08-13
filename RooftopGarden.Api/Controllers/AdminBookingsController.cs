using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Bookings.Commands.ApproveBooking;
using RooftopGarden.Application.Features.Bookings.Commands.RejectBooking;
using RooftopGarden.Application.Features.Bookings.Dtos;
using RooftopGarden.Application.Features.Bookings.Queries.GetAdminBookingById;
using RooftopGarden.Application.Features.Bookings.Queries.GetAdminBookings;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/admin/bookings")]
[Authorize(Roles = Roles.Admin)]
public class AdminBookingsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminBookingsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<BookingDto>>> GetBookings(
        [FromQuery] AdminBookingFilterRequest filter,
        CancellationToken cancellationToken)
    {
        var query = new GetAdminBookingsQuery(filter.CustomerId, filter.ServiceId, filter.Status, filter.PageNumber, filter.PageSize);
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookingDto>> GetBookingById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAdminBookingByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id:int}/approve")]
    public async Task<ActionResult<BookingDto>> ApproveBooking(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new ApproveBookingCommand(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id:int}/reject")]
    public async Task<ActionResult<BookingDto>> RejectBooking(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new RejectBookingCommand(id), cancellationToken);
        return Ok(result);
    }
}
