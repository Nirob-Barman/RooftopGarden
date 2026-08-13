using MediatR;
using RooftopGarden.Application.Features.Customers.Dtos;

namespace RooftopGarden.Application.Features.Customers.Queries.GetCustomerById;

public record GetCustomerByIdQuery(string CustomerId) : IRequest<CustomerDto>;
