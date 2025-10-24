using FluentAssertions;
using TaskApi.Dtos;
using TaskApi.Models;
using TaskApi.Services;
using TaskApi.Storage;

namespace TaskApi.UnitTests;

public class TaskServiceTests
{
  private ITaskRepository _repository = null!;
  private TaskService _service = null!;

  public TaskServiceTests()
  {
    _repository = new InMemoryTaskRepository();
    _service = new TaskService(_repository);
  }

  [Fact]
  public async Task CreateTask_ShouldCreateTaskWithTrimmedDescription()
  {
    // Arrange
    var request = new CreateTaskRequest { Description = "  Test Task  " };

    // Act
    var result = await _service.CreateTaskAsync(request);

    // Assert
    result.Should().NotBeNull();
    result.Description.Should().Be("Test Task");
    result.IsCompleted.Should().BeFalse();
  }

  [Fact]
  public async Task GetAllTasks_ShouldReturnAllTasks()
  {
    // Arrange
    await _service.CreateTaskAsync(new CreateTaskRequest { Description = "Task 1" });
    await _service.CreateTaskAsync(new CreateTaskRequest { Description = "Task 2" });

    // Act
    var result = await _service.GetAllTasksAsync();

    // Assert
    result.Should().HaveCount(2);
  }

  [Fact]
  public async Task GetAllTasks_WithActiveStatus_ShouldReturnOnlyActiveTasks()
  {
    // Arrange
    var task1 = await _service.CreateTaskAsync(new CreateTaskRequest { Description = "Active Task" });
    var task2 = await _service.CreateTaskAsync(new CreateTaskRequest { Description = "Completed Task" });
    await _service.UpdateTaskAsync(task2.Id, new UpdateTaskRequest { IsCompleted = true });

    // Act
    var result = await _service.GetAllTasksAsync("active");

    // Assert
    result.Should().HaveCount(1);
    result.First().Id.Should().Be(task1.Id);
  }

  [Fact]
  public async Task UpdateTask_ShouldUpdateTaskProperties()
  {
    // Arrange
    var task = await _service.CreateTaskAsync(new CreateTaskRequest { Description = "Original Task" });
    var updateRequest = new UpdateTaskRequest 
    { 
      Description = "Updated Task", 
      IsCompleted = true 
    };

    // Act
    var result = await _service.UpdateTaskAsync(task.Id, updateRequest);

    // Assert
    result.Should().NotBeNull();
    result!.Description.Should().Be("Updated Task");
    result.IsCompleted.Should().BeTrue();
  }

  [Fact]
  public async Task DeleteTask_ShouldRemoveTask()
  {
    // Arrange
    var task = await _service.CreateTaskAsync(new CreateTaskRequest { Description = "Task to Delete" });

    // Act
    var result = await _service.DeleteTaskAsync(task.Id);

    // Assert
    result.Should().BeTrue();
    var deletedTask = await _service.GetTaskByIdAsync(task.Id);
    deletedTask.Should().BeNull();
  }

  [Fact]
  public async Task GetTaskById_WithNonExistentId_ShouldReturnNull()
  {
    // Arrange
    var nonExistentId = Guid.NewGuid();

    // Act
    var result = await _service.GetTaskByIdAsync(nonExistentId);

    // Assert
    result.Should().BeNull();
  }
}