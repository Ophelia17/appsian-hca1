using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text;
using System.Text.Json;
using TaskApi.Dtos;

namespace TaskApi.IntegrationTests;

public class TasksControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
  private readonly WebApplicationFactory<Program> _factory;

  public TasksControllerIntegrationTests(WebApplicationFactory<Program> factory)
  {
    _factory = factory;
  }

  private async Task<HttpClient> CreateClientAsync()
  {
    var client = _factory.CreateClient();
    // Clear the repository before each test
    await client.PostAsync("/api/tasks/clear", null);
    return client;
  }

  [Fact]
  public async Task GetTasks_ShouldReturnEmptyList_WhenNoTasksExist()
  {
    // Act
    using var client = await CreateClientAsync();
    var response = await client.GetAsync("/api/tasks");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var content = await response.Content.ReadAsStringAsync();
    var tasks = JsonSerializer.Deserialize<List<TaskDto>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    tasks.Should().BeEmpty();
  }

  [Fact]
  public async Task CreateTask_ShouldCreateTask_WhenValidRequest()
  {
    // Arrange
    using var client = await CreateClientAsync();
    var request = new CreateTaskRequest { Description = "Test Task" };
    var json = JsonSerializer.Serialize(request);
    var content = new StringContent(json, Encoding.UTF8, "application/json");

    // Act
    var response = await client.PostAsync("/api/tasks", content);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Created);
    var responseContent = await response.Content.ReadAsStringAsync();
    var task = JsonSerializer.Deserialize<TaskDto>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    task.Should().NotBeNull();
    task!.Description.Should().Be("Test Task");
    task.IsCompleted.Should().BeFalse();
  }

  [Fact]
  public async Task CreateTask_ShouldReturnBadRequest_WhenDescriptionIsEmpty()
  {
    // Arrange
    using var client = await CreateClientAsync();
    var request = new CreateTaskRequest { Description = "" };
    var json = JsonSerializer.Serialize(request);
    var content = new StringContent(json, Encoding.UTF8, "application/json");

    // Act
    var response = await client.PostAsync("/api/tasks", content);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task UpdateTask_ShouldUpdateTask_WhenValidRequest()
  {
    // Arrange - Create a task first
    using var client = await CreateClientAsync();
    var createRequest = new CreateTaskRequest { Description = "Original Task" };
    var createJson = JsonSerializer.Serialize(createRequest);
    var createContent = new StringContent(createJson, Encoding.UTF8, "application/json");
    var createResponse = await client.PostAsync("/api/tasks", createContent);
    var createdTask = JsonSerializer.Deserialize<TaskDto>(await createResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

    // Arrange - Update request
    var updateRequest = new UpdateTaskRequest { Description = "Updated Task", IsCompleted = true };
    var updateJson = JsonSerializer.Serialize(updateRequest);
    var updateContent = new StringContent(updateJson, Encoding.UTF8, "application/json");

    // Act
    var response = await client.PutAsync($"/api/tasks/{createdTask!.Id}", updateContent);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var responseContent = await response.Content.ReadAsStringAsync();
    var updatedTask = JsonSerializer.Deserialize<TaskDto>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    updatedTask.Should().NotBeNull();
    updatedTask!.Description.Should().Be("Updated Task");
    updatedTask.IsCompleted.Should().BeTrue();
  }

  [Fact]
  public async Task DeleteTask_ShouldReturnNoContent_WhenTaskExists()
  {
    // Arrange - Create a task first
    using var client = await CreateClientAsync();
    var createRequest = new CreateTaskRequest { Description = "Task to Delete" };
    var createJson = JsonSerializer.Serialize(createRequest);
    var createContent = new StringContent(createJson, Encoding.UTF8, "application/json");
    var createResponse = await client.PostAsync("/api/tasks", createContent);
    var createdTask = JsonSerializer.Deserialize<TaskDto>(await createResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

    // Act
    var response = await client.DeleteAsync($"/api/tasks/{createdTask!.Id}");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.NoContent);
  }

  [Fact]
  public async Task DeleteTask_ShouldReturnNotFound_WhenTaskDoesNotExist()
  {
    // Arrange
    using var client = await CreateClientAsync();
    var nonExistentId = Guid.NewGuid();

    // Act
    var response = await client.DeleteAsync($"/api/tasks/{nonExistentId}");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.NotFound);
  }
}