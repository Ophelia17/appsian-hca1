using TaskApi.Services;
using TaskApi.Storage;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
  .AddJsonOptions(options =>
  {
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
  });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register application services
builder.Services.AddSingleton<ITaskRepository, InMemoryTaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

// Configure CORS
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowFrontend", policy =>
  {
    policy.WithOrigins("http://localhost:5173", "http://localhost:5175")
          .AllowAnyHeader()
          .AllowAnyMethod();
  });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseRouting();
app.MapControllers();

app.Run();

// Make Program class accessible for testing
public partial class Program { }
