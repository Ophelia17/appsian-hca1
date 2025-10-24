using TaskApi.Dtos;
using TaskApi.Models;
using TaskApi.Storage;

namespace TaskApi.Services;

/// <summary>
/// Service implementation for task business operations.
/// </summary>
public class TaskService : ITaskService
{
  private readonly ITaskRepository _repository;

  public TaskService(ITaskRepository repository)
  {
    _repository = repository;
  }

  public async Task<IEnumerable<TaskDto>> GetAllTasksAsync(string? status = null)
  {
    bool? isCompleted = status?.ToLower() switch
    {
      "active" => false,
      "completed" => true,
      _ => null
    };

    var tasks = await _repository.GetByStatusAsync(isCompleted);
    return tasks.Select(MapToDto);
  }

  public async Task<TaskDto?> GetTaskByIdAsync(Guid id)
  {
    var task = await _repository.GetByIdAsync(id);
    return task != null ? MapToDto(task) : null;
  }

  public async Task<TaskDto> CreateTaskAsync(CreateTaskRequest request)
  {
    var task = new TaskItem
    {
      Id = Guid.NewGuid(),
      Description = request.Description.Trim(),
      IsCompleted = false
    };

    var createdTask = await _repository.CreateAsync(task);
    return MapToDto(createdTask);
  }

  public async Task<TaskDto?> UpdateTaskAsync(Guid id, UpdateTaskRequest request)
  {
    var existingTask = await _repository.GetByIdAsync(id);
    if (existingTask == null)
    {
      return null;
    }

    // Apply updates
    if (request.Description != null)
    {
      existingTask.Description = request.Description.Trim();
    }

    if (request.IsCompleted.HasValue)
    {
      existingTask.IsCompleted = request.IsCompleted.Value;
    }

    var updatedTask = await _repository.UpdateAsync(id, existingTask);
    return updatedTask != null ? MapToDto(updatedTask) : null;
  }

  public async Task<bool> DeleteTaskAsync(Guid id)
  {
    return await _repository.DeleteAsync(id);
  }

  public async Task ClearAllTasksAsync()
  {
    await _repository.ClearAsync();
  }

  private static TaskDto MapToDto(TaskItem task)
  {
    return new TaskDto
    {
      Id = task.Id,
      Description = task.Description,
      IsCompleted = task.IsCompleted
    };
  }
}
