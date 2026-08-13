using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Api.Extensions;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Bookings.Commands.CancelBooking;
using RooftopGarden.Application.Features.Bookings.Commands.CreateBooking;
using RooftopGarden.Application.Features.Bookings.Dtos;
using RooftopGarden.Application.Features.Bookings.Queries.GetBookingById;
using RooftopGarden.Application.Features.Bookings.Queries.GetBookings;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize(Roles = Roles.Customer)]
public class BookingsController : ControllerBase
{
    private readonly ISender _sender;

    public BookingsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] CreateBookingRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateBookingCommand(
            User.GetUserId(),
            request.ServiceId,
            request.BookingDate,
            request.PreferredTime,
            request.Address,
            request.Notes);

        var result = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetBookingById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<BookingDto>>> GetBookings(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetBookingsQuery(User.GetUserId(), pageNumber, pageSize), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookingDto>> GetBookingById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetBookingByIdQuery(User.GetUserId(), id), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id:int}/cancel")]
    public async Task<ActionResult<BookingDto>> CancelBooking(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new CancelBookingCommand(User.GetUserId(), id), cancellationToken);
        return Ok(result);
    }
}
