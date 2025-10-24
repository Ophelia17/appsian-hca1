import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load page and show empty state', async ({ page }) => {
    await expect(page.getByText('Basic Task Manager')).toBeVisible();
    await expect(page.getByText('No tasks yet')).toBeVisible();
    await expect(page.getByText('Add your first task above to get started!')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    const taskDescription = 'Test task from Playwright';
    
    // Fill in the task form
    await page.getByPlaceholder('Add a new task...').fill(taskDescription);
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Wait for the task to appear
    await expect(page.getByText(taskDescription)).toBeVisible();
    await expect(page.getByText('Task created successfully!')).toBeVisible();
    
    // Verify the task is in the list
    await expect(page.getByText('Active (1)')).toBeVisible();
  });

  test('should toggle task completion', async ({ page }) => {
    // Create a task first
    await page.getByPlaceholder('Add a new task...').fill('Task to toggle');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Wait for task to be created
    await expect(page.getByText('Task to toggle')).toBeVisible();
    
    // Toggle the task completion
    await page.getByRole('checkbox').check();
    
    // Verify the task is marked as completed
    await expect(page.getByText('Task marked as completed!')).toBeVisible();
    await expect(page.getByText('Completed (1)')).toBeVisible();
    
    // Toggle back to active
    await page.getByRole('checkbox').uncheck();
    await expect(page.getByText('Task marked as active!')).toBeVisible();
  });

  test('should filter tasks correctly', async ({ page }) => {
    // Create multiple tasks
    await page.getByPlaceholder('Add a new task...').fill('Active task 1');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    await page.getByPlaceholder('Add a new task...').fill('Active task 2');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    await page.getByPlaceholder('Add a new task...').fill('Completed task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Mark one task as completed
    const checkboxes = page.getByRole('checkbox');
    await checkboxes.nth(2).check();
    
    // Test All filter
    await page.getByRole('button', { name: 'All (3)' }).click();
    await expect(page.getByText('Active task 1')).toBeVisible();
    await expect(page.getByText('Active task 2')).toBeVisible();
    await expect(page.getByText('Completed task')).toBeVisible();
    
    // Test Active filter
    await page.getByRole('button', { name: 'Active (2)' }).click();
    await expect(page.getByText('Active task 1')).toBeVisible();
    await expect(page.getByText('Active task 2')).toBeVisible();
    await expect(page.getByText('Completed task')).not.toBeVisible();
    
    // Test Completed filter
    await page.getByRole('button', { name: 'Completed (1)' }).click();
    await expect(page.getByText('Active task 1')).not.toBeVisible();
    await expect(page.getByText('Active task 2')).not.toBeVisible();
    await expect(page.getByText('Completed task')).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // Create a task
    await page.getByPlaceholder('Add a new task...').fill('Task to delete');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Wait for task to be created
    await expect(page.getByText('Task to delete')).toBeVisible();
    
    // Delete the task
    await page.getByRole('button', { name: 'Delete' }).click();
    
    // Confirm deletion in the dialog
    await page.getByRole('button', { name: 'OK' }).click();
    
    // Verify task is deleted
    await expect(page.getByText('Task deleted successfully!')).toBeVisible();
    await expect(page.getByText('Task to delete')).not.toBeVisible();
    await expect(page.getByText('No tasks yet')).toBeVisible();
  });

  test('should show character count for long descriptions', async ({ page }) => {
    const longDescription = 'a'.repeat(251);
    
    await page.getByPlaceholder('Add a new task...').fill(longDescription);
    
    // Verify character count is shown
    await expect(page.getByText('251/300 characters')).toBeVisible();
  });

  test('should prevent empty task creation', async ({ page }) => {
    const addButton = page.getByRole('button', { name: 'Add Task' });
    
    // Button should be disabled when input is empty
    await expect(addButton).toBeDisabled();
    
    // Button should be disabled when input has only whitespace
    await page.getByPlaceholder('Add a new task...').fill('   ');
    await expect(addButton).toBeDisabled();
  });

  test('should show loading states', async ({ page }) => {
    // Fill form and click add
    await page.getByPlaceholder('Add a new task...').fill('Loading test task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Should show loading state
    await expect(page.getByText('Adding...')).toBeVisible();
    
    // Wait for loading to complete
    await expect(page.getByText('Loading test task')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept API calls and return error
    await page.route('**/api/tasks', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    // Try to create a task
    await page.getByPlaceholder('Add a new task...').fill('Error test task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Should show error message
    await expect(page.getByText('Failed to create task. Please try again.')).toBeVisible();
  });
});
