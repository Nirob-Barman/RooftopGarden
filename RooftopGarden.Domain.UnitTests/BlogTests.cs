
using FluentAssertions;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Domain.UnitTests
{
    public class BlogTests
    {
        [Fact]
        public void Constructor_WithValidValues_CreatesBlog()
        {
            // Arrange
            var before = DateTime.UtcNow;

            // Act
            var blog = new Blog(
                "Rooftop Gardening Tips",
                "How to grow vegetables on a rooftop.",
                "author-123",
                "image.jpg");

            // Assert
            blog.Title.Should().Be("Rooftop Gardening Tips");
            blog.Content.Should().Be("How to grow vegetables on a rooftop.");
            blog.AuthorId.Should().Be("author-123");
            blog.ImageUrl.Should().Be("image.jpg");
            blog.CreatedAt.Should().BeOnOrAfter(before);
            blog.UpdatedAt.Should().BeNull();
        }

        [Fact]
        public void Constructor_WithEmptyTitle_ThrowsArgumentException()
        {
            // Act
            var action = () => new Blog(
                string.Empty,
                "Blog content",
                "author-123");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Title is required.*");
        }

        [Fact]
        public void Constructor_WithWhitespaceTitle_ThrowsArgumentException()
        {
            // Act
            var action = () => new Blog(
                "   ",
                "Blog content",
                "author-123");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Title is required.*");
        }

        [Fact]
        public void Constructor_WithEmptyContent_ThrowsArgumentException()
        {
            // Act
            var action = () => new Blog(
                "Blog title",
                string.Empty,
                "author-123");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Content is required.*");
        }

        [Fact]
        public void Constructor_WithWhitespaceContent_ThrowsArgumentException()
        {
            // Act
            var action = () => new Blog(
                "Blog title",
                "   ",
                "author-123");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Content is required.*");
        }

        [Fact]
        public void Constructor_WithEmptyAuthorId_ThrowsArgumentException()
        {
            // Act
            var action = () => new Blog(
                "Blog title",
                "Blog content",
                string.Empty);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("AuthorId is required.*");
        }

        [Fact]
        public void Constructor_WithWhitespaceAuthorId_ThrowsArgumentException()
        {
            // Act
            var action = () => new Blog(
                "Blog title",
                "Blog content",
                "   ");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("AuthorId is required.*");
        }

        [Fact]
        public void Update_WithValidValues_UpdatesBlog()
        {
            // Arrange
            var blog = new Blog(
                "Old title",
                "Old content",
                "author-123",
                "old.jpg");

            // Act
            blog.Update(
                "New title",
                "New content",
                "new.jpg");

            // Assert
            blog.Title.Should().Be("New title");
            blog.Content.Should().Be("New content");
            blog.ImageUrl.Should().Be("new.jpg");
            blog.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void Update_WithEmptyTitle_ThrowsArgumentException()
        {
            // Arrange
            var blog = new Blog(
                "Old title",
                "Old content",
                "author-123");

            // Act
            var action = () => blog.Update(
                string.Empty,
                "New content",
                null);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Title is required.*");
        }

        [Fact]
        public void Update_WithEmptyContent_ThrowsArgumentException()
        {
            // Arrange
            var blog = new Blog(
                "Old title",
                "Old content",
                "author-123");

            // Act
            var action = () => blog.Update(
                "New title",
                string.Empty,
                null);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Content is required.*");
        }

        [Fact]
        public void Update_WithValidValues_SetsImageUrlToNull()
        {
            // Arrange
            var blog = new Blog(
                "Old title",
                "Old content",
                "author-123",
                "old.jpg");

            // Act
            blog.Update(
                "New title",
                "New content",
                null);

            // Assert
            blog.ImageUrl.Should().BeNull();
        }
    }
}
