using MediatR;
using RooftopGarden.Application.Features.Customers.Dtos;

namespace RooftopGarden.Application.Features.Customers.Commands.LockCustomer;

public record LockCustomerCommand(string CustomerId) : IRequest<CustomerDto>;
