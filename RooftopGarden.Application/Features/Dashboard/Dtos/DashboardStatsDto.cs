namespace RooftopGarden.Application.Features.Dashboard.Dtos;

public record DashboardStatsDto(
    int TotalCustomers,
    int TotalProducts,
    int ActiveProducts,
    int TotalOrders,
    decimal TotalRevenue,
    Dictionary<string, int> OrdersByStatus,
    int TotalBookings,
    Dictionary<string, int> BookingsByStatus,
    int TotalServices,
    int ActiveServices);
