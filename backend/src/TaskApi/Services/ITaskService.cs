using TaskApi.Dtos;

namespace TaskApi.Services;

/// <summary>
/// Service interface for task business operations.
/// </summary>
public interface ITaskService
{
  Task<IEnumerable<TaskDto>> GetAllTasksAsync(string? status = null);
  Task<TaskDto?> GetTaskByIdAsync(Guid id);
  Task<TaskDto> CreateTaskAsync(CreateTaskRequest request);
  Task<TaskDto?> UpdateTaskAsync(Guid id, UpdateTaskRequest request);
  Task<bool> DeleteTaskAsync(Guid id);
  Task ClearAllTasksAsync();
}
