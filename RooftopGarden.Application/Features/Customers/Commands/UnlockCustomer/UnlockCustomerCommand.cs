using MediatR;
using RooftopGarden.Application.Features.Customers.Dtos;

namespace RooftopGarden.Application.Features.Customers.Commands.UnlockCustomer;

public record UnlockCustomerCommand(string CustomerId) : IRequest<CustomerDto>;
