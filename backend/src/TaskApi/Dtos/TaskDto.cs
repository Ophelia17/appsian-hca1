namespace TaskApi.Dtos;

/// <summary>
/// Data transfer object for task items.
/// </summary>
public class TaskDto
{
  public Guid Id { get; set; }
  public string Description { get; set; } = string.Empty;
  public bool IsCompleted { get; set; }
}
