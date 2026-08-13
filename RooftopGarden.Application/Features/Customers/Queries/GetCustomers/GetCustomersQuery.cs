using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Customers.Dtos;

namespace RooftopGarden.Application.Features.Customers.Queries.GetCustomers;

public record GetCustomersQuery(string? Search, int PageNumber, int PageSize) : IRequest<PagedResult<CustomerDto>>;
