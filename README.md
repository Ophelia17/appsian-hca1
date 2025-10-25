# Basic Task Manager

A modern task management application built with .NET 8 Web API and React/TypeScript, featuring a clean Bootstrap UI and comprehensive testing.

## 🚀 Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+ (for frontend)
- Git

### Backend (API)
```bash
cd backend
dotnet restore
dotnet run
```
- **API**: http://localhost:5187
- **Swagger UI**: http://localhost:5187/swagger

### Frontend (React)
```bash
cd frontend/task-ui
npm install
npm run dev
```
- **Frontend**: http://localhost:5173

## 🏗️ Architecture

### Backend (.NET 8)
- **Framework**: ASP.NET Core Web API
- **Storage**: In-memory with thread-safe ConcurrentDictionary
- **Architecture**: Clean layered architecture (Controllers → Services → Storage)
- **Validation**: Data annotations with custom business rules
- **CORS**: Configured for frontend communication
- **Documentation**: Swagger/OpenAPI integration

### Frontend (React/TypeScript)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Bootstrap 5 + Bootswatch Lux theme
- **State Management**: Custom hooks with localStorage persistence
- **HTTP Client**: Axios with error handling
- **Testing**: Vitest + React Testing Library

## 📋 Features

### Task Management
- ✅ Create, read, update, delete tasks
- ✅ Toggle task completion status
- ✅ Filter by status (All/Active/Completed)
- ✅ Real-time task counts
- ✅ Input validation (1-300 characters)

### User Experience
- 🎨 Modern Bootstrap UI with Lux theme
- 📱 Responsive design for mobile/desktop
- 🔔 Toast notifications for user feedback
- 💾 LocalStorage persistence for offline capability
- ⚡ Loading states and error handling
- 🎯 Empty states with helpful messaging

### Developer Experience
- 🧪 Comprehensive test coverage
- 📝 TypeScript for type safety
- 🔧 ESLint + Prettier for code quality
- 📚 Swagger API documentation
- 🚀 Hot reload for development

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks (optional `?status=all\|active\|completed`) |
| `GET` | `/api/tasks/{id}` | Get specific task |
| `POST` | `/api/tasks` | Create new task |
| `PUT` | `/api/tasks/{id}` | Update existing task |
| `DELETE` | `/api/tasks/{id}` | Delete task |
| `POST` | `/api/tasks/clear` | Clear all tasks (testing) |

### Request/Response Models

**Task Model:**
```csharp
public class TaskItem {
  public Guid Id { get; set; }
  public string Description { get; set; }
  public bool IsCompleted { get; set; }
}
```

**Create Task Request:**
```json
{
  "description": "Task description (1-300 characters)"
}
```

**Update Task Request:**
```json
{
  "description": "Updated description (optional)",
  "isCompleted": true
}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
dotnet test
```
- **Unit Tests**: Service layer business logic
- **Integration Tests**: Full HTTP request/response cycles
- **Coverage**: CRUD operations, validation, error handling

### Frontend Tests
```bash
cd frontend/task-ui
npm run test
```
- **Component Tests**: React component behavior
- **User Interactions**: Form submissions, button clicks
- **State Management**: Hook behavior and state updates

### End-to-End Tests
```bash
cd frontend/task-ui
npx playwright test
```
- **User Flows**: Complete task management workflows
- **Cross-Browser**: Chrome, Firefox, Safari, Mobile
- **API Testing**: Direct endpoint validation

## 📁 Project Structure

```
appsian-hca/
├── README.md
├── .editorconfig
├── .gitattributes
├── .github/workflows/ci.yml
├── backend/
│   ├── TaskApi.sln
│   ├── src/TaskApi/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Storage/
│   │   ├── Models/
│   │   ├── Dtos/
│   │   └── Program.cs
│   └── tests/
│       ├── TaskApi.UnitTests/
│       └── TaskApi.IntegrationTests/
└── frontend/task-ui/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── state/
    │   ├── types/
    │   └── api/
    ├── tests/
    └── playwright.config.ts
```

## 🔧 Development

### Key Decisions
1. **In-memory storage**: Simple, fast, suitable for HCA-1 requirements
2. **Client-side filtering**: Snappy UX with server-side support
3. **LocalStorage persistence**: Offline capability and data recovery
4. **Bootstrap + Lux theme**: Professional appearance with minimal setup
5. **Comprehensive testing**: Unit, integration, and E2E coverage

## 🚀 Deployment

### Local Development
1. Start backend: `cd backend && dotnet run`
2. Start frontend: `cd frontend/task-ui && npm run dev`
3. Access: http://localhost:5173

### Production Considerations
- Replace in-memory storage with database
- Add authentication/authorization
- Implement proper error logging
- Add monitoring and health checks
- Configure HTTPS and security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is for educational purposes as part of the HCA-1 assessment.
