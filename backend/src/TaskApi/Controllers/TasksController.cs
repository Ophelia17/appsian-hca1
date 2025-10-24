using Microsoft.AspNetCore.Mvc;
using TaskApi.Dtos;
using TaskApi.Services;

namespace TaskApi.Controllers;

/// <summary>
/// Controller for task management operations.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
  private readonly ITaskService _taskService;

  public TasksController(ITaskService taskService)
  {
    _taskService = taskService;
  }

  /// <summary>
  /// Gets all tasks with optional status filtering.
  /// </summary>
  /// <param name="status">Filter by status: all, active, or completed</param>
  /// <returns>List of tasks</returns>
  [HttpGet]
  public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks([FromQuery] string? status = null)
  {
    var tasks = await _taskService.GetAllTasksAsync(status);
    return Ok(tasks);
  }

  /// <summary>
  /// Gets a specific task by ID.
  /// </summary>
  /// <param name="id">Task ID</param>
  /// <returns>Task details</returns>
  [HttpGet("{id}")]
  public async Task<ActionResult<TaskDto>> GetTask(Guid id)
  {
    var task = await _taskService.GetTaskByIdAsync(id);
    if (task == null)
    {
      return NotFound();
    }
    return Ok(task);
  }

  /// <summary>
  /// Creates a new task.
  /// </summary>
  /// <param name="request">Task creation request</param>
  /// <returns>Created task</returns>
  [HttpPost]
  public async Task<ActionResult<TaskDto>> CreateTask([FromBody] CreateTaskRequest request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var task = await _taskService.CreateTaskAsync(request);
    return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
  }

  /// <summary>
  /// Updates an existing task.
  /// </summary>
  /// <param name="id">Task ID</param>
  /// <param name="request">Task update request</param>
  /// <returns>Updated task</returns>
  [HttpPut("{id}")]
  public async Task<ActionResult<TaskDto>> UpdateTask(Guid id, [FromBody] UpdateTaskRequest request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    // Validate that at least one field is provided
    if (request.Description == null && !request.IsCompleted.HasValue)
    {
      return BadRequest("At least one field must be provided for update");
    }

    var task = await _taskService.UpdateTaskAsync(id, request);
    if (task == null)
    {
      return NotFound();
    }

    return Ok(task);
  }

  /// <summary>
  /// Deletes a task.
  /// </summary>
  /// <param name="id">Task ID</param>
  /// <returns>No content</returns>
  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleteTask(Guid id)
  {
    var deleted = await _taskService.DeleteTaskAsync(id);
    if (!deleted)
    {
      return NotFound();
    }

    return NoContent();
  }

  /// <summary>
  /// Clears all tasks (for testing purposes).
  /// </summary>
  /// <returns>No content</returns>
  [HttpPost("clear")]
  public async Task<ActionResult> ClearTasks()
  {
    await _taskService.ClearAllTasksAsync();
    return NoContent();
  }
}
