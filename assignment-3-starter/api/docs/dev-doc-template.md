# Assignment 3 – Developer Documentation

## 1. Overview

This API provides authenticated access to mail messages for a corporate mail system, with role-based access control, logging, rate limiting, and centralized error handling.

* Users can log in and access their own mail messages.
* Admins can access any mail message.
* Request IDs are included in logs and error responses for debugging.

---

## 2. Authentication

### 2.1 Auth Method

* Scheme: Bearer token (JWT)
* How to obtain a token:

  * Endpoint: `POST /auth/login`
  * Request body format:

    ```json
    {
      "username": "admin",
      "password": "password"
    }
    ```
  * Example success response:

    ```json
    {
      "token": "jwt_here"
    }
    ```
  * Example failure response:

    ```json
    {
      "error": "AuthenticationError",
      "message": "Invalid credentials",
      "statusCode": 401,
      "requestId": "req-12345",
      "timestamp": "2026-04-24T21:00:00Z"
    }
    ```

### 2.2 Using the Token

* Required header for authenticated requests:

  * `Authorization: Bearer <token>`

Mention any expiry behavior:

* Tokens are valid for 1 hour.
* Expired or invalid tokens return `401 Unauthorized`.

---

## 3. Roles & Access Rules

Describe each role and what it can do.

* `admin`

  * Can view any mail message.
* `user`

  * Can only view their own mail messages.

You can include a simple matrix:

| Endpoint      | Method | admin      | user            |
| ------------- | ------ | ---------- | --------------- |
| `/mail/:id`   | GET    | ✅ all mail | ✅ own mail only |
| `/auth/login` | POST   | ✅          | ✅               |
| `/status`     | GET    | ✅          | ✅               |

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

Common failure reasons:

* Invalid credentials → `401 AuthenticationError`
* Missing fields → `400 BadRequest`

Example invalid credentials response:

```json
{
  "error": "AuthenticationError",
  "message": "Invalid credentials",
  "statusCode": 401
}
```

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
  "message": "Access denied",
  "statusCode": 403,
  "requestId": "req-12345",
  "timestamp": "2026-04-24T21:10:00Z"
}
```

**Example Not Found Response:**

```json
{
  "error": "NotFound",
  "message": "Mail not found",
  "statusCode": 404
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

* Keyed by: IP address
* Limit: `RATE_LIMIT_MAX` requests per `RATE_LIMIT_WINDOW_SECONDS`
* What happens when the limit is exceeded:

  * Example response:

    ```json
    {
      "error": "RateLimitError",
      "message": "Too many requests",
      "statusCode": 429,
      "requestId": "req-67890",
      "timestamp": "2026-04-24T21:15:00Z"
    }
    ```

You can also mention if you set a `Retry-After` header or include a field in the JSON.

Example:

```http
Retry-After: 60
```

---

## 6. Error Response Format

Briefly describe the standard error JSON returned by your centralized error handler.

Example:

```json
{
  "error": "Forbidden",
  "message": "Access denied",
  "statusCode": 403,
  "requestId": "req-abc123",
  "timestamp": "2026-04-24T21:20:00Z"
}
```

List a few common error categories you use:

* `BadRequest`
* `AuthenticationError`
* `Unauthorized`
* `Forbidden`
* `NotFound`
* `RateLimitError`
* `InternalServerError`

---

## 7. Example Flows

Provide at least one complete “happy path” and one “error path”:

### 7.1 Happy Path: Login + Access Own Mail

1. `POST /auth/login` as `user1`:

```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"user1","password":"user123"}'
```

Response:

```json
{
  "token": "jwt_here"
}
```

2. `GET /mail/2` with that token:

```bash
curl http://localhost:3000/mail/2 \
-H "Authorization: Bearer jwt_here"
```

Response:

```json
{
  "id": 2,
  "userId": 2,
  "subject": "Hello User1",
  "body": "Your report is ready."
}
```

### 7.2 Error Path: User Accessing Someone Else’s Mail

1. Login as `user1`.
2. `GET /mail/1` (which belongs to another user):

```bash
curl http://localhost:3000/mail/1 \
-H "Authorization: Bearer jwt_here"
```

3. Show the `403` response:

```json
{
  "error": "Forbidden",
  "message": "Access denied",
  "statusCode": 403,
  "requestId": "req-99999",
  "timestamp": "2026-04-24T21:25:00Z"
}
```