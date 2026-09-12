
using FluentAssertions;
using RooftopGarden.Application.Features.Categories.Commands.CreateCategory;

namespace RooftopGarden.Application.UnitTests.Features.Categories.Validators
{
    public class CreateCategoryCommandValidatorTests
    {
        private readonly CreateCategoryCommandValidator _validator;

        public CreateCategoryCommandValidatorTests()
        {
            _validator = new CreateCategoryCommandValidator();
        }

        [Fact]
        public async Task Should_Fail_When_Name_Is_Empty()
        {
            // Arrange
            var command = new CreateCategoryCommand(
                string.Empty,
                null);

            // Act
            var result = await _validator.ValidateAsync(command);

            // Assert
            result.IsValid.Should().BeFalse();
        }

        [Fact]
        public async Task Should_Pass_When_Name_Is_Valid()
        {
            // Arrange
            var command = new CreateCategoryCommand(
                "Vegetables",
                null);

            // Act
            var result = await _validator.ValidateAsync(command);

            // Assert
            result.IsValid.Should().BeTrue();
        }

        [Fact]
        public async Task Should_Fail_When_Name_Is_Whitespace()
        {
            // Arrange
            var command = new CreateCategoryCommand(
                "   ",
                null);

            // Act
            var result = await _validator.ValidateAsync(command);

            // Assert
            result.IsValid.Should().BeFalse();
        }

        [Fact]
        public async Task Should_Fail_When_Name_Exceeds_Maximum_Length()
        {
            // Arrange
            var longName = new string('A', 101);

            var command = new CreateCategoryCommand(
                longName,
                null);

            // Act
            var result = await _validator.ValidateAsync(command);

            // Assert
            result.IsValid.Should().BeFalse();
        }

        [Fact]
        public async Task Should_Pass_When_Description_Is_Null()
        {
            // Arrange
            var command = new CreateCategoryCommand(
                "Vegetables",
                null);

            // Act
            var result = await _validator.ValidateAsync(command);

            // Assert
            result.IsValid.Should().BeTrue();
        }


    }
}
