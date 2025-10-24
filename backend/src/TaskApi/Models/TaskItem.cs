namespace TaskApi.Models;

/// <summary>
/// Represents a task item in the system.
/// </summary>
public class TaskItem
{
  public Guid Id { get; set; }
  public string Description { get; set; } = string.Empty;
  public bool IsCompleted { get; set; }
}
