# Assignment 3 – Developer Documentation

## 1. Overview

Briefly describe what this API does and the main use case.

- Example: “This API provides authenticated access to mail messages for a corporate mail system, with role-based access control, logging, rate limiting, and centralized error handling.”

---

## 2. Authentication

### 2.1 Auth Method

- Scheme: Bearer token (JWT)
- How to obtain a token:
  - Endpoint: `POST /auth/login`
  - Request body format:
    ```json
    {
      "username": "user1",
      "password": "user123"
    }
    ```
  - Example success response:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
    ```

### 2.2 Using the Token

- Required header for authenticated requests:
  - `Authorization: Bearer <token>`

Mention any expiry behavior (e.g., tokens are valid for 1 hour).

---

## 3. Roles & Access Rules

Describe each role and what it can do.

Example:

- `admin`
  - Can view any mail message.
- `user`
  - Can only view their own mail messages.

You can include a simple matrix:

| Endpoint        | Method | admin | user |
|----------------|--------|-------|------|
| `/mail/:id`    | GET    | ✅ all mail | ✅ own mail only |
| `/auth/login`  | POST   | ✅ | ✅ |
| `/status`      | GET    | ✅ | ✅ |

---

## 4. Endpoints

### 4.1 `POST /auth/login`

**Description:**  
Authenticate with username/password and receive a JWT.

**Request Body:**

```json
{
  "username": "user1",
  "password": "user123"
}
```

**Success Response (200):**

```json
{
  "token": "..."
}
```

**Notes:**
Document any common failure reasons (invalid credentials, missing fields).

---

### 4.2 `GET /mail/:id`

**Description:**
Retrieve a single mail message by ID.

**Authentication:**

* Requires `Authorization: Bearer <token>` header.

**Access Rules:**

* `admin`: may view any mail ID.
* `user`: may view only mail where `mail.userId` matches their own `userId`.

**Example Request:**

```bash
curl http://localhost:3000/mail/2 \
  -H "Authorization: Bearer <token>"
```

**Example Success Response (200):**

```json
{
  "id": 2,
  "userId": 2,
  "subject": "Hello User1",
  "body": "Your report is ready."
}
```

**Example Forbidden Response (when user tries to access someone else’s mail):**

```json
{
  "error": "Forbidden",
  "message": "User does not have permission to access this resource.",
  "statusCode": 403,
  "requestId": "req-12345",
  "timestamp": "2025-11-30T14:22:00Z"
}
```

---

### 4.3 `GET /status`

**Description:**
Simple health check to confirm the API is running.

**Authentication:**

* None required.

**Example Response (200):**

```json
{
  "status": "ok"
}
```

---

## 5. Rate Limiting

Describe how rate limiting works in your implementation.

* Keyed by: (IP address) or (userId from token).
* Limit: e.g. `RATE_LIMIT_MAX` requests per `RATE_LIMIT_WINDOW_SECONDS`.
* What happens when the limit is exceeded:

  * Example response:

    ```json
    {
      "error": "TooManyRequests",
      "message": "Rate limit exceeded. Please try again later.",
      "statusCode": 429,
      "requestId": "req-67890",
      "timestamp": "2025-11-30T14:30:00Z"
    }
    ```

You can also mention if you set a `Retry-After` header or include a field in the JSON.

---

## 6. Error Response Format

Briefly describe the standard error JSON returned by your centralized error handler.

Example:

```json
{
  "error": "Forbidden",
  "message": "User does not have permission to access this resource.",
  "statusCode": 403,
  "requestId": "req-abc123",
  "timestamp": "2025-11-30T14:35:00Z"
}
```

List a few common error categories you use (`BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `TooManyRequests`, `InternalServerError`, etc.).

---

## 7. Example Flows

Provide at least one complete “happy path” and one “error path”:

### 7.1 Happy Path: Login + Access Own Mail

1. `POST /auth/login` as `user1` → receive token.
2. `GET /mail/2` with that token → receive mail details.

Include the exact curl commands and example responses.

### 7.2 Error Path: User Accessing Someone Else’s Mail

1. Login as `user1`.
2. `GET /mail/1` (which belongs to another user).
3. Show the `403` response.