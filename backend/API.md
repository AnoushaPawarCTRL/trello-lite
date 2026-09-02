### POST /api/auth/register
Public. Registers a new user.

**Body:**
```json
{ "username": "string", "email": "string", "password": "string (min 8 chars)" }
```

**Responses:**
- `200 OK` → `{ "token": "string", "username": "string" }`
- `400 Bad Request` → validation failure, e.g. `{ "message": "email: Email must be a valid email address" }`
- `409 Conflict` → username or email already in use

### POST /api/auth/login
Public. Authenticates an existing user.

**Body:**
```json
{ "email": "string", "password": "string" }
```

**Responses:**
- `200 OK` → `{ "token": "string", "username": "string" }`
- `401 Unauthorized` → `"Invalid credentials"` — returned for wrong password, non-existent email, or missing fields (no request-level validation on this endpoint; a missing field simply fails to match any user)

## Projects

### POST /api/projects
Requires authentication (`Authorization: Bearer <token>`).

**Body:**
```json
{ "name": "string", "description": "string" }
```

**Responses:**
- `200 OK` → `{ "id": number, "name": "string", "description": "string", "ownerUsername": "string", "tasks": [] }`
- `403 Forbidden` → missing/invalid/expired token


### GET /api/projects
Requires authentication. Returns all projects owned by the authenticated user.

**Responses:**
- `200 OK` → array of project objects (same shape as POST response)

### GET /api/projects/{id}
Requires authentication. Returns a single project by id.

**Responses:**
- `200 OK` → `{ "id": number, "name": "string", "description": "string", "ownerUsername": "string", "tasks": [] }`
- `404 Not Found` → `{ "message": "Project not found with id: {id}" }`