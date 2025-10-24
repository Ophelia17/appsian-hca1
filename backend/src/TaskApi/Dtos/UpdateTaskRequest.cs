using System.ComponentModel.DataAnnotations;

namespace TaskApi.Dtos;

/// <summary>
/// Request model for updating an existing task.
/// </summary>
public class UpdateTaskRequest
{
  [StringLength(300, MinimumLength = 1, ErrorMessage = "Description must be between 1 and 300 characters")]
  public string? Description { get; set; }
  
  public bool? IsCompleted { get; set; }
}
