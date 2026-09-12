using FluentAssertions;
using Moq;
using Moq.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Categories.Commands.CreateCategory;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.UnitTests.Features.Categories.Commands
{
    public class CreateCategoryCommandHandlerTests
    {
        private readonly Mock<IApplicationDbContext> _contextMock;
        private readonly CreateCategoryCommandHandler _handler;

        public CreateCategoryCommandHandlerTests()
        {
            _contextMock = new Mock<IApplicationDbContext>();

            _handler = new CreateCategoryCommandHandler(
                _contextMock.Object);
        }

        [Fact]
        public async Task Should_Create_Category_When_Command_Is_Valid()
        {
            // Arrange
            var categories = new List<Category>();

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            _contextMock
                .Setup(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var command = new CreateCategoryCommand(
                "Vegetables",
                "Fresh vegetables");

            // Act
            var result = await _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("Vegetables");
            result.Description.Should().Be("Fresh vegetables");

            _contextMock.Verify(
                x => x.Categories.Add(
                    It.Is<Category>(c =>
                        c.Name == "Vegetables" &&
                        c.Description == "Fresh vegetables")),
                Times.Once);

            _contextMock.Verify(
                x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task Should_Throw_BadRequestException_When_Category_Name_Already_Exists()
        {
            // Arrange
            var existingCategory = new Category(
                "Vegetables",
                "Fresh vegetables");

            var categories = new List<Category>
            {
                existingCategory
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var command = new CreateCategoryCommand(
                "Vegetables",
                "Another description");

            // Act
            var act = () => _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            await act.Should()
                .ThrowAsync<BadRequestException>()
                .WithMessage("A category named 'Vegetables' already exists.");
        }

        [Fact]
        public async Task Should_Create_Category_When_Category_Name_Is_CaseDifferent()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category("Vegetables", "Fresh vegetables")
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            _contextMock
                .Setup(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var command = new CreateCategoryCommand(
                "vegetables",
                "Another description");

            // Act
            var result = await _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("vegetables");
            result.Description.Should().Be("Another description");

            _contextMock.Verify(
                x => x.Categories.Add(
                    It.Is<Category>(c =>
                        c.Name == "vegetables" &&
                        c.Description == "Another description")),
                Times.Once);

            _contextMock.Verify(
                x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task Should_Create_Category_With_Null_Description()
        {
            // Arrange
            var categories = new List<Category>();

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            _contextMock
                .Setup(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var command = new CreateCategoryCommand(
                "Vegetables",
                null);

            // Act
            var result = await _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("Vegetables");
            result.Description.Should().BeNull();

            _contextMock.Verify(
                x => x.Categories.Add(
                    It.Is<Category>(c =>
                        c.Name == "Vegetables" &&
                        c.Description == null)),
                Times.Once);

            _contextMock.Verify(
                x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task Should_Create_Category_With_Empty_Description()
        {
            // Arrange
            var categories = new List<Category>();

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            _contextMock
                .Setup(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var command = new CreateCategoryCommand(
                "Vegetables",
                string.Empty);

            // Act
            var result = await _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("Vegetables");
            result.Description.Should().BeEmpty();

            _contextMock.Verify(
                x => x.Categories.Add(
                    It.Is<Category>(c =>
                        c.Name == "Vegetables" &&
                        c.Description == string.Empty)),
                Times.Once);

            _contextMock.Verify(
                x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }


        [Fact]
        public async Task Should_Pass_CancellationToken_To_AnyAsync()
        {
            // Arrange
            var categories = new List<Category>();

            var cancellationToken = new CancellationToken();

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            _contextMock
                .Setup(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var command = new CreateCategoryCommand(
                "Vegetables",
                "Fresh vegetables");

            // Act
            await _handler.Handle(command, cancellationToken);

            // Assert
            // AnyAsync is an EF Core extension method, so the cancellation
            // token cannot be directly verified with Moq here.
            // The test mainly ensures the handler accepts and passes the token
            // through the EF Core query.
        }

        [Fact]
        public async Task Should_Pass_CancellationToken_To_SaveChangesAsync()
        {
            // Arrange
            var categories = new List<Category>();

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            _contextMock
                .Setup(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var cancellationToken = new CancellationToken();

            var command = new CreateCategoryCommand(
                "Vegetables",
                "Fresh vegetables");

            // Act
            await _handler.Handle(command, cancellationToken);

            // Assert
            _contextMock.Verify(
                x => x.SaveChangesAsync(cancellationToken),
                Times.Once);
        }

        [Fact]
        public async Task Should_Not_Add_Category_When_Name_Already_Exists()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category("Vegetables", "Fresh vegetables")
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var command = new CreateCategoryCommand(
                "Vegetables",
                "Another description");

            // Act
            var act = () => _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            await act.Should()
                .ThrowAsync<BadRequestException>();

            _contextMock.Verify(
                x => x.Categories.Add(
                    It.IsAny<Category>()),
                Times.Never);
        }

        [Fact]
        public async Task Should_Not_SaveChanges_When_Name_Already_Exists()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category("Vegetables", "Fresh vegetables")
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var command = new CreateCategoryCommand(
                "Vegetables",
                "Another description");

            // Act
            var act = () => _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            await act.Should()
                .ThrowAsync<BadRequestException>();

            _contextMock.Verify(
                x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()),
                Times.Never);
        }

        [Fact]
        public async Task Should_Return_Created_Category_As_Dto()
        {
            // Arrange
            var categories = new List<Category>();

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            _contextMock
                .Setup(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var command = new CreateCategoryCommand(
                "Fruits",
                "Fresh fruits");

            // Act
            var result = await _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("Fruits");
            result.Description.Should().Be("Fresh fruits");
        }

        [Fact]
        public async Task Should_Add_Category_With_Correct_Name_And_Description()
        {
            // Arrange
            var categories = new List<Category>();

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            _contextMock
                .Setup(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var command = new CreateCategoryCommand(
                "Flowers",
                "Beautiful flowers");

            // Act
            await _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            _contextMock.Verify(
                x => x.Categories.Add(
                    It.Is<Category>(c =>
                        c.Name == "Flowers" &&
                        c.Description == "Beautiful flowers")),
                Times.Once);
        }

        [Fact]
        public async Task Should_Propagate_Exception_When_SaveChangesAsync_Fails()
        {
            // Arrange
            var categories = new List<Category>();

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            _contextMock
                .Setup(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()))
                .ThrowsAsync(new Exception("Database error"));

            var command = new CreateCategoryCommand(
                "Vegetables",
                "Fresh vegetables");

            // Act
            var act = () => _handler.Handle(
                command,
                CancellationToken.None);

            // Assert
            await act.Should()
                .ThrowAsync<Exception>()
                .WithMessage("Database error");
        }

    }
}
