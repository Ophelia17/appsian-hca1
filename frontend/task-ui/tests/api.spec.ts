import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('should get tasks from API', async ({ request }) => {
    const response = await request.get('http://localhost:5187/api/tasks');
    expect(response.status()).toBe(200);
    
    const tasks = await response.json();
    expect(Array.isArray(tasks)).toBe(true);
  });

  test('should create task via API', async ({ request }) => {
    const newTask = {
      description: 'API test task'
    };
    
    const response = await request.post('http://localhost:5187/api/tasks', {
      data: newTask
    });
    
    expect(response.status()).toBe(201);
    
    const task = await response.json();
    expect(task.description).toBe('API test task');
    expect(task.isCompleted).toBe(false);
    expect(task.id).toBeDefined();
  });

  test('should update task via API', async ({ request }) => {
    // First create a task
    const createResponse = await request.post('http://localhost:5187/api/tasks', {
      data: { description: 'Task to update' }
    });
    const createdTask = await createResponse.json();
    
    // Update the task
    const updateResponse = await request.put(`http://localhost:5187/api/tasks/${createdTask.id}`, {
      data: { isCompleted: true }
    });
    
    expect(updateResponse.status()).toBe(200);
    
    const updatedTask = await updateResponse.json();
    expect(updatedTask.isCompleted).toBe(true);
    expect(updatedTask.description).toBe('Task to update');
  });

  test('should delete task via API', async ({ request }) => {
    // First create a task
    const createResponse = await request.post('http://localhost:5187/api/tasks', {
      data: { description: 'Task to delete' }
    });
    const createdTask = await createResponse.json();
    
    // Delete the task
    const deleteResponse = await request.delete(`http://localhost:5187/api/tasks/${createdTask.id}`);
    
    expect(deleteResponse.status()).toBe(204);
    
    // Verify task is deleted
    const getResponse = await request.get(`http://localhost:5187/api/tasks/${createdTask.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should filter tasks by status', async ({ request }) => {
    // Clear existing tasks first
    await request.post('http://localhost:5187/api/tasks/clear');
    
    // Create some tasks
    await request.post('http://localhost:5187/api/tasks', {
      data: { description: 'Active task' }
    });
    
    const completedResponse = await request.post('http://localhost:5187/api/tasks', {
      data: { description: 'Completed task' }
    });
    const completedTask = await completedResponse.json();
    
    // Mark one as completed
    await request.put(`http://localhost:5187/api/tasks/${completedTask.id}`, {
      data: { isCompleted: true }
    });
    
    // Test filtering
    const activeResponse = await request.get('http://localhost:5187/api/tasks?status=active');
    const activeTasks = await activeResponse.json();
    expect(activeTasks).toHaveLength(1);
    expect(activeTasks[0].description).toBe('Active task');
    
    const completedResponse2 = await request.get('http://localhost:5187/api/tasks?status=completed');
    const completedTasks = await completedResponse2.json();
    expect(completedTasks).toHaveLength(1);
    expect(completedTasks[0].description).toBe('Completed task');
  });

  test('should validate task creation', async ({ request }) => {
    // Test empty description
    const emptyResponse = await request.post('http://localhost:5187/api/tasks', {
      data: { description: '' }
    });
    expect(emptyResponse.status()).toBe(400);
    
    // Test too long description
    const longDescription = 'a'.repeat(301);
    const longResponse = await request.post('http://localhost:5187/api/tasks', {
      data: { description: longDescription }
    });
    expect(longResponse.status()).toBe(400);
  });
});
