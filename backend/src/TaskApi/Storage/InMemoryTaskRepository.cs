using System.Collections.Concurrent;
using TaskApi.Models;

namespace TaskApi.Storage;

/// <summary>
/// In-memory implementation of task repository using thread-safe ConcurrentDictionary.
/// </summary>
public class InMemoryTaskRepository : ITaskRepository
{
  private readonly ConcurrentDictionary<Guid, TaskItem> _tasks = new();

  public Task<IEnumerable<TaskItem>> GetAllAsync()
  {
    return Task.FromResult(_tasks.Values.AsEnumerable());
  }

  public Task<IEnumerable<TaskItem>> GetByStatusAsync(bool? isCompleted)
  {
    var tasks = _tasks.Values.AsEnumerable();
    
    if (isCompleted.HasValue)
    {
      tasks = tasks.Where(t => t.IsCompleted == isCompleted.Value);
    }
    
    return Task.FromResult(tasks);
  }

  public Task<TaskItem?> GetByIdAsync(Guid id)
  {
    _tasks.TryGetValue(id, out var task);
    return Task.FromResult(task);
  }

  public Task<TaskItem> CreateAsync(TaskItem task)
  {
    _tasks.TryAdd(task.Id, task);
    return Task.FromResult(task);
  }

  public Task<TaskItem?> UpdateAsync(Guid id, TaskItem task)
  {
    if (_tasks.TryGetValue(id, out var existingTask))
    {
      _tasks.TryUpdate(id, task, existingTask);
      return Task.FromResult<TaskItem?>(task);
    }
    
    return Task.FromResult<TaskItem?>(null);
  }

  public Task<bool> DeleteAsync(Guid id)
  {
    return Task.FromResult(_tasks.TryRemove(id, out _));
  }

  public Task ClearAsync()
  {
    _tasks.Clear();
    return Task.CompletedTask;
  }
}
