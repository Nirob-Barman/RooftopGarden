using FluentAssertions;
using RooftopGarden.Application.Features.Categories.Commands.CreateCategory;

namespace RooftopGarden.Application.UnitTests.Features.Categories.Commands
{
    public class CreateCategoryCommandTests
    {
        [Fact]
        public void Should_Create_Command_With_Name_And_Description()
        {
            // Arrange
            const string name = "Vegetables";
            const string description = "Fresh vegetables";

            // Act
            var command = new CreateCategoryCommand(
                name,
                description);

            // Assert
            command.Name.Should().Be(name);
            command.Description.Should().Be(description);
        }

        [Fact]
        public void Should_Create_Command_Without_Description()
        {
            // Arrange
            const string name = "Vegetables";

            // Act
            var command = new CreateCategoryCommand(
                name,
                null);

            // Assert
            command.Name.Should().Be(name);
            command.Description.Should().BeNull();
        }
    }
}
