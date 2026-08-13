using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Payments.Dtos;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Payments.Commands.MakePayment;

public class MakePaymentCommandHandler : IRequestHandler<MakePaymentCommand, PaymentDto>
{
    private readonly IApplicationDbContext _dbContext;

    public MakePaymentCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PaymentDto> Handle(MakePaymentCommand request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.CustomerId == request.CustomerId, cancellationToken)
            ?? throw new NotFoundException("Order", request.OrderId);

        if (order.OrderStatus == OrderStatus.Cancelled)
        {
            throw new BadRequestException("Cannot pay for a cancelled order.");
        }

        if (order.Payment is not null)
        {
            throw new BadRequestException("This order has already been paid.");
        }

        var payment = new Payment(order.Id, request.CustomerId, order.TotalAmount, request.PaymentMethod);
        payment.MarkAsPaid(Guid.NewGuid().ToString("N"));

        order.MarkPaymentStatus(PaymentStatus.Paid);

        _dbContext.Payments.Add(payment);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return payment.ToDto();
    }
}
