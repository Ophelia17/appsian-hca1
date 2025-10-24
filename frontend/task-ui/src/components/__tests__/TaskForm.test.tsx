import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from '../TaskForm';

describe('TaskForm', () => {
  it('renders form elements', () => {
    const mockOnSubmit = vi.fn();
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);

    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);

    const input = screen.getByPlaceholderText('Add a new task...');
    const button = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ description: 'Test task' });
    });
  });

  it('disables button when loading', () => {
    const mockOnSubmit = vi.fn();
    render(<TaskForm onSubmit={mockOnSubmit} loading={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Adding...')).toBeInTheDocument();
  });

  it('disables button when input is empty', () => {
    const mockOnSubmit = vi.fn();
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows character count when approaching limit', () => {
    const mockOnSubmit = vi.fn();
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);

    const input = screen.getByPlaceholderText('Add a new task...');
    fireEvent.change(input, { target: { value: 'a'.repeat(251) } });

    expect(screen.getByText('251/300 characters')).toBeInTheDocument();
  });
});
