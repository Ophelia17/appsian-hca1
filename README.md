# Basic Task Manager

A simple task management application built with .NET 8 Web API and React/TypeScript.

## Quick Start

### Backend (API)
```bash
cd backend
dotnet restore
dotnet run
```
API runs on http://localhost:5187
Swagger UI: http://localhost:5187/swagger

### Frontend (React)
```bash
cd frontend/task-ui
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Architecture

- **Backend**: .NET 8 Web API with in-memory storage
- **Frontend**: React/TypeScript with Vite, Bootstrap 5 + Bootswatch Lux
- **Testing**: xUnit (API), Vitest + RTL (React), Playwright (E2E)

## Endpoints

- `GET /api/tasks` - Get all tasks (with optional status filter)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Model

```csharp
public class TaskItem {
  public Guid Id { get; set; }
  public string Description { get; set; }
  public bool IsCompleted { get; set; }
}
```

## Testing

- **Unit Tests**: `dotnet test` (backend), `npm run test` (frontend)
- **Integration Tests**: `dotnet test` (backend)
- **E2E Tests**: `npx playwright test`

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).