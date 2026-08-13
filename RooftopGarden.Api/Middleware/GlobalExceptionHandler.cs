using System.Net;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using RooftopGarden.Api.Common.Responses;
using RooftopGarden.Application.Common.Exceptions;

namespace RooftopGarden.Api.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (statusCode, message, errors) = Map(exception);

        if (statusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(
                exception,
                "Unhandled exception processing {Method} {Path}",
                httpContext.Request.Method,
                httpContext.Request.Path);
        }
        else
        {
            _logger.LogWarning(
                exception,
                "Request {Method} {Path} failed with {StatusCode}: {Message}",
                httpContext.Request.Method,
                httpContext.Request.Path,
                (int)statusCode,
                message);
        }

        httpContext.Response.StatusCode = (int)statusCode;
        httpContext.Response.ContentType = "application/json";

        await httpContext.Response.WriteAsJsonAsync(new ErrorResponse(false, message, errors), cancellationToken);

        return true;
    }

    private static (HttpStatusCode StatusCode, string Message, IReadOnlyCollection<string> Errors) Map(Exception exception) => exception switch
    {
        ValidationException validationException => (
            HttpStatusCode.BadRequest,
            "Validation failed.",
            validationException.Errors.Select(e => e.ErrorMessage).ToList()),

        BadRequestException badRequestException => (
            HttpStatusCode.BadRequest,
            badRequestException.Message,
            Array.Empty<string>()),

        NotFoundException notFoundException => (
            HttpStatusCode.NotFound,
            notFoundException.Message,
            Array.Empty<string>()),

        IdentityException identityException => (
            HttpStatusCode.Conflict,
            "The request could not be completed.",
            identityException.Errors),

        UnauthorizedAccessException unauthorizedAccessException => (
            HttpStatusCode.Unauthorized,
            unauthorizedAccessException.Message,
            Array.Empty<string>()),

        ArgumentException argumentException => (
            HttpStatusCode.BadRequest,
            argumentException.Message,
            Array.Empty<string>()),

        InvalidOperationException invalidOperationException => (
            HttpStatusCode.Conflict,
            invalidOperationException.Message,
            Array.Empty<string>()),

        _ => (
            HttpStatusCode.InternalServerError,
            "An unexpected error occurred.",
            Array.Empty<string>())
    };
}
