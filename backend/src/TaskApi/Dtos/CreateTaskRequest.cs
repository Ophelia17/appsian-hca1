using System.ComponentModel.DataAnnotations;

namespace TaskApi.Dtos;

/// <summary>
/// Request model for creating a new task.
/// </summary>
public class CreateTaskRequest
{
  [Required(ErrorMessage = "Description is required")]
  [StringLength(300, MinimumLength = 1, ErrorMessage = "Description must be between 1 and 300 characters")]
  public string Description { get; set; } = string.Empty;
}
