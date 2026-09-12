using FluentAssertions;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Domain.UnitTests.Entities
{
    public class ReviewTests
    {
        [Fact]
        public void Constructor_WithValidValues_CreatesReview()
        {
            // Arrange
            var before = DateTime.UtcNow;

            // Act
            var review = new Review(
                10,
                "customer-123",
                5,
                "Excellent product!");

            // Assert
            review.ProductId.Should().Be(10);
            review.CustomerId.Should().Be("customer-123");
            review.Rating.Should().Be(5);
            review.Comment.Should().Be("Excellent product!");
            review.CreatedAt.Should().BeOnOrAfter(before);
        }

        [Fact]
        public void Constructor_WithEmptyCustomerId_ThrowsArgumentException()
        {
            // Act
            var action = () => new Review(
                10,
                string.Empty,
                5);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("CustomerId is required.*");
        }

        [Fact]
        public void Constructor_WithWhitespaceCustomerId_ThrowsArgumentException()
        {
            // Act
            var action = () => new Review(
                10,
                "   ",
                5);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("CustomerId is required.*");
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(6)]
        [InlineData(10)]
        public void Constructor_WithInvalidRating_ThrowsArgumentOutOfRangeException(
            int rating)
        {
            // Act
            var action = () => new Review(
                10,
                "customer-123",
                rating);

            // Assert
            action.Should()
                .Throw<ArgumentOutOfRangeException>()
                .WithMessage("Rating must be between 1 and 5.*");
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        [InlineData(4)]
        [InlineData(5)]
        public void Constructor_WithValidRating_CreatesReview(int rating)
        {
            // Act
            var review = new Review(
                10,
                "customer-123",
                rating);

            // Assert
            review.Rating.Should().Be(rating);
        }

        [Fact]
        public void Constructor_WithoutComment_CreatesReviewWithNullComment()
        {
            // Act
            var review = new Review(
                10,
                "customer-123",
                5);

            // Assert
            review.Comment.Should().BeNull();
        }

        [Fact]
        public void Update_WithValidValues_UpdatesRatingAndComment()
        {
            // Arrange
            var review = new Review(
                10,
                "customer-123",
                3,
                "Average");

            // Act
            review.Update(5, "Excellent!");

            // Assert
            review.Rating.Should().Be(5);
            review.Comment.Should().Be("Excellent!");
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(6)]
        [InlineData(10)]
        public void Update_WithInvalidRating_ThrowsArgumentOutOfRangeException(
            int rating)
        {
            // Arrange
            var review = new Review(
                10,
                "customer-123",
                3,
                "Average");

            // Act
            var action = () => review.Update(
                rating,
                "Updated comment");

            // Assert
            action.Should()
                .Throw<ArgumentOutOfRangeException>()
                .WithMessage("Rating must be between 1 and 5.*");
        }

        [Fact]
        public void Update_WithNullComment_SetsCommentToNull()
        {
            // Arrange
            var review = new Review(
                10,
                "customer-123",
                5,
                "Excellent!");

            // Act
            review.Update(4, null);

            // Assert
            review.Rating.Should().Be(4);
            review.Comment.Should().BeNull();
        }
    }
}
