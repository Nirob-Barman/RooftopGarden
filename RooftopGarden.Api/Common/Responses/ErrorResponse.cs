namespace RooftopGarden.Api.Common.Responses;

public record ErrorResponse(bool Success, string Message, IReadOnlyCollection<string> Errors);
