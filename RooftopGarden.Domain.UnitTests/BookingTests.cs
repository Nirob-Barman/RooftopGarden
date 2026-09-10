
using FluentAssertions;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Domain.UnitTests
{
    public class BookingTests
    {
        private static Service CreateActiveService()
        {
            return new Service(
                "Garden Maintenance",
                100m,
                TimeSpan.FromHours(2));
        }

        private static Booking CreateBooking(
            BookingStatus? status = null)
        {
            var booking = new Booking(
                "customer-123",
                CreateActiveService(),
                DateTime.UtcNow.Date.AddDays(1),
                TimeSpan.FromHours(10),
                "123 Garden Street",
                "Test booking");

            if (status == BookingStatus.Approved)
                booking.Approve();
            else if (status == BookingStatus.Rejected)
                booking.Reject();
            else if (status == BookingStatus.Cancelled)
                booking.Cancel();
            else if (status == BookingStatus.Completed)
            {
                booking.Approve();
                booking.Complete();
            }

            return booking;
        }

        [Fact]
        public void Constructor_WithValidValues_CreatesBooking()
        {
            // Arrange
            var service = CreateActiveService();
            var bookingDate = DateTime.UtcNow.Date.AddDays(1);
            var preferredTime = TimeSpan.FromHours(10);

            // Act
            var booking = new Booking(
                "customer-123",
                service,
                bookingDate,
                preferredTime,
                "123 Garden Street",
                "Test booking");

            // Assert
            booking.CustomerId.Should().Be("customer-123");
            booking.Service.Should().BeSameAs(service);
            booking.ServiceId.Should().Be(service.Id);
            booking.BookingDate.Should().Be(bookingDate);
            booking.PreferredTime.Should().Be(preferredTime);
            booking.Address.Should().Be("123 Garden Street");
            booking.Notes.Should().Be("Test booking");
            booking.Status.Should().Be(BookingStatus.Pending);
        }

        [Fact]
        public void Constructor_WithEmptyCustomerId_ThrowsArgumentException()
        {
            // Act
            var action = () => new Booking(
                string.Empty,
                CreateActiveService(),
                DateTime.UtcNow.Date.AddDays(1),
                TimeSpan.FromHours(10),
                "123 Garden Street");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("CustomerId is required.*");
        }

        [Fact]
        public void Constructor_WithNullService_ThrowsArgumentNullException()
        {
            // Act
            var action = () => new Booking(
                "customer-123",
                null!,
                DateTime.UtcNow.Date.AddDays(1),
                TimeSpan.FromHours(10),
                "123 Garden Street");

            // Assert
            action.Should().Throw<ArgumentNullException>();
        }

        [Fact]
        public void Constructor_WithInactiveService_ThrowsInvalidOperationException()
        {
            // Arrange
            var service = CreateActiveService();
            service.Deactivate();

            // Act
            var action = () => new Booking(
                "customer-123",
                service,
                DateTime.UtcNow.Date.AddDays(1),
                TimeSpan.FromHours(10),
                "123 Garden Street");

            // Assert
            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage("Cannot book an inactive service.");
        }

        [Fact]
        public void Constructor_WithPastBookingDate_ThrowsArgumentException()
        {
            // Act
            var action = () => new Booking(
                "customer-123",
                CreateActiveService(),
                DateTime.UtcNow.Date.AddDays(-1),
                TimeSpan.FromHours(10),
                "123 Garden Street");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Booking date cannot be in the past.*");
        }

        [Fact]
        public void Constructor_WithEmptyAddress_ThrowsArgumentException()
        {
            // Act
            var action = () => new Booking(
                "customer-123",
                CreateActiveService(),
                DateTime.UtcNow.Date.AddDays(1),
                TimeSpan.FromHours(10),
                string.Empty);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Address is required.*");
        }

        [Fact]
        public void CanBeCancelled_WhenPending_ReturnsTrue()
        {
            // Arrange
            var booking = CreateBooking();

            // Act
            var result = booking.CanBeCancelled();

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void CanBeCancelled_WhenApproved_ReturnsTrue()
        {
            // Arrange
            var booking = CreateBooking(BookingStatus.Approved);

            // Act
            var result = booking.CanBeCancelled();

            // Assert
            result.Should().BeTrue();
        }

        [Theory]
        [InlineData(BookingStatus.Cancelled)]
        [InlineData(BookingStatus.Rejected)]
        [InlineData(BookingStatus.Completed)]
        public void CanBeCancelled_WhenNotPendingOrApproved_ReturnsFalse(
            BookingStatus status)
        {
            // Arrange
            var booking = CreateBooking(status);

            // Act
            var result = booking.CanBeCancelled();

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void Cancel_WhenPending_SetsStatusToCancelled()
        {
            // Arrange
            var booking = CreateBooking();

            // Act
            booking.Cancel();

            // Assert
            booking.Status.Should().Be(BookingStatus.Cancelled);
        }

        [Fact]
        public void Cancel_WhenApproved_SetsStatusToCancelled()
        {
            // Arrange
            var booking = CreateBooking(BookingStatus.Approved);

            // Act
            booking.Cancel();

            // Assert
            booking.Status.Should().Be(BookingStatus.Cancelled);
        }

        [Theory]
        [InlineData(BookingStatus.Cancelled)]
        [InlineData(BookingStatus.Rejected)]
        [InlineData(BookingStatus.Completed)]
        public void Cancel_WhenNotCancellable_ThrowsInvalidOperationException(
            BookingStatus status)
        {
            // Arrange
            var booking = CreateBooking(status);

            // Act
            var action = () => booking.Cancel();

            // Assert
            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage("This booking is no longer eligible for cancellation.");
        }

        [Fact]
        public void Approve_WhenPending_SetsStatusToApproved()
        {
            // Arrange
            var booking = CreateBooking();

            // Act
            booking.Approve();

            // Assert
            booking.Status.Should().Be(BookingStatus.Approved);
        }

        [Theory]
        [InlineData(BookingStatus.Approved)]
        [InlineData(BookingStatus.Rejected)]
        [InlineData(BookingStatus.Cancelled)]
        [InlineData(BookingStatus.Completed)]
        public void Approve_WhenNotPending_ThrowsInvalidOperationException(
            BookingStatus status)
        {
            // Arrange
            var booking = CreateBooking(status);

            // Act
            var action = () => booking.Approve();

            // Assert
            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage("Only a pending booking can be approved.");
        }

        [Fact]
        public void Reject_WhenPending_SetsStatusToRejected()
        {
            // Arrange
            var booking = CreateBooking();

            // Act
            booking.Reject();

            // Assert
            booking.Status.Should().Be(BookingStatus.Rejected);
        }

        [Theory]
        [InlineData(BookingStatus.Approved)]
        [InlineData(BookingStatus.Rejected)]
        [InlineData(BookingStatus.Cancelled)]
        [InlineData(BookingStatus.Completed)]
        public void Reject_WhenNotPending_ThrowsInvalidOperationException(
            BookingStatus status)
        {
            // Arrange
            var booking = CreateBooking(status);

            // Act
            var action = () => booking.Reject();

            // Assert
            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage("Only a pending booking can be rejected.");
        }

        [Fact]
        public void Complete_WhenApproved_SetsStatusToCompleted()
        {
            // Arrange
            var booking = CreateBooking(BookingStatus.Approved);

            // Act
            booking.Complete();

            // Assert
            booking.Status.Should().Be(BookingStatus.Completed);
        }

        [Theory]
        [InlineData(BookingStatus.Pending)]
        [InlineData(BookingStatus.Rejected)]
        [InlineData(BookingStatus.Cancelled)]
        [InlineData(BookingStatus.Completed)]
        public void Complete_WhenNotApproved_ThrowsInvalidOperationException(
            BookingStatus status)
        {
            // Arrange
            var booking = CreateBooking(status);

            // Act
            var action = () => booking.Complete();

            // Assert
            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage("Only an approved booking can be completed.");
        }
    }
}
