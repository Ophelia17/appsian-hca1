using TaskApi.Models;

namespace TaskApi.Storage;

/// <summary>
/// Repository interface for task storage operations.
/// </summary>
public interface ITaskRepository
{
  Task<IEnumerable<TaskItem>> GetAllAsync();
  Task<IEnumerable<TaskItem>> GetByStatusAsync(bool? isCompleted);
  Task<TaskItem?> GetByIdAsync(Guid id);
  Task<TaskItem> CreateAsync(TaskItem task);
  Task<TaskItem?> UpdateAsync(Guid id, TaskItem task);
  Task<bool> DeleteAsync(Guid id);
  Task ClearAsync();
}
