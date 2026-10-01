# Trello Lite

A full stack task management app for organising projects and tasks, built with a React and TypeScript frontend, a Spring Boot REST API and a PostgreSQL database.

**Live demo:** coming soon (deployment in progress)

## Features

* Secure registration and login with JWT authentication
* Protected routes, so only signed in users can access their dashboard
* Create projects and view them on a personal dashboard
* Add tasks to a project, with title, description and optional deadline
* Track task status (To Do, In Progress, Done) from a dropdown
* Edit tasks inline and delete them with a confirmation prompt
* Deadline alerts that flag overdue tasks in red

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Java, Spring Boot, Spring Security, Spring Data JPA |
| Database | PostgreSQL (H2 in memory database for tests) |
| Auth | JSON Web Tokens (JWT) |
| Testing | @SpringBootTest, MockMvc, Postman |

## How It Works

The React frontend talks to the Spring Boot API over HTTP. On login, the API returns a JWT, which the frontend stores and attaches to every request through an Axios interceptor. Spring Security validates the token on each request through a custom JWT filter, and expired or invalid tokens return a 401 so the user is sent back to the login page.

Errors are handled centrally with `@RestControllerAdvice` and custom exceptions, so the API always returns clear, consistent JSON error responses.

## API Endpoints

### Auth
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in and receive a JWT |

### Projects
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/projects` | List projects |
| GET | `/api/projects/{id}` | Get a single project |
| POST | `/api/projects` | Create a project |

### Tasks
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks/project/{projectId}` | List tasks in a project |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Edit a task's title, description or deadline |
| PUT | `/api/tasks/{id}/status` | Update a task's status |
| DELETE | `/api/tasks/{id}` | Delete a task |

## Running Locally

### Prerequisites
* Java 17 or later
* Node.js and npm
* PostgreSQL

### Backend
1. Create a PostgreSQL database for the app.
2. In `backend/src/main/resources/`, copy `application.properties.example` to `application.properties` and fill in your database details and JWT secret.
3. From the `backend` folder, run:
   ```bash
   mvn spring-boot:run
   ```
   The API runs on `http://localhost:8080`.

### Frontend
1. From the `frontend` folder, run:
   ```bash
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173`.

## Testing

Integration tests use `@SpringBootTest` with MockMvc and an in memory H2 database, covering authentication, projects and tasks through the real JWT security filter chain.

```bash
cd backend
mvn test
```

## Roadmap

* Deploy with Docker behind an Nginx reverse proxy, served over HTTPS with Let's Encrypt
* Add project editing and deletion
* Add ownership checks so users can only access their own projects and tasks
* Add input validation on project creation
