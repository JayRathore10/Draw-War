# Draw War – Server Documentation

## Overview

This is the backend server for **Draw War**, a 1 vs 1 real-time drawing game.  
The server handles authentication and user management.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Zod Validation

---

## Folder Structure

```
server/
├── src/
│   ├── configs/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── types/
│   ├── validation/
│   ├── app.ts
│   └── server.ts
```

---

## Base Routes

```
/api/auth
/api/user
```

---

# Authentication Routes

## Login

**POST** `/api/auth/login`

Authenticate user and return JWT token.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Response

```json
{
  "success": true,
  "message": "Login Successfully",
  "user": {},
  "token": "jwt_token"
}
```

---

## Signup

**POST** `/api/auth/signup`

Register a new user.

### Request Body

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password"
}
```

### Response

```json
{
  "success": true,
  "user": {},
  "message": "New user created"
}
```

---

## Logout

**POST** `/api/auth/logout`

Clear authentication cookie.

### Response

```json
{
  "success": true,
  "message": "Cookie clear successfully"
}
```

---

## Get Current User

**GET** `/api/auth/me`

### Headers

```
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "user": {}
}
```

---

## Test

**GET** `/api/auth/test`

```json
{
  "success": true,
  "message": "Test Clear"
}
```

---

# User Routes

## Test

**GET** `/api/user/test`

```json
{
  "success": true,
  "message": "All alright"
}
```

---

## Get All Users (Admin Only)

**GET** `/api/user/`

> Note: This route should be protected and accessible only by admin.

### Response

```json
{
  "success": true,
  "message": "All Users",
  "users": []
}
```

---

## Get User by Username

**GET** `/api/user/:username`

### Params

```
username: string
```

### Response

```json
{
  "success": true,
  "message": "User",
  "user": {}
}
```

---

## Authentication Flow

1. User signs up or logs in  
2. Input validated using Zod  
3. Password hashed using bcrypt  
4. JWT token generated  
5. Token sent via cookie and response  
6. Protected routes require:

```
Authorization: Bearer <token>
```

---

## Security Features

- Password hashing using bcrypt  
- JWT authentication  
- HTTP-only cookies  
- Input validation with Zod  

---

## Environment Variables

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
SALT_ROUND=10
```

---

## Running the Server

### Install

```
npm install
```

### Development

```
npm run dev
```

### Production

```
npm start
```

---

## Notes

- Ensure MongoDB is running  
- Use HTTPS in production  
- `/api/auth/me` requires valid token  
- Admin middleware should protect `/api/user/`  

---

## Future Improvements

- Role-based authorization  
- Rate limiting  
- Game APIs (rooms, matchmaking, drawing sync)  
- WebSocket integration  