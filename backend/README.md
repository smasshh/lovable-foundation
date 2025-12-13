# Task Manager API - FastAPI Backend

A production-ready FastAPI backend with JWT authentication and PostgreSQL database.

## Tech Stack

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **python-jose** - JWT authentication
- **passlib** - Password hashing (bcrypt)
- **Pydantic** - Request/response validation

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/taskmanager
JWT_SECRET=your-super-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7
FRONTEND_URL=http://localhost:5173
```

### 4. Create PostgreSQL Database

```sql
CREATE DATABASE taskmanager;
```

### 5. Run the Server

```bash
uvicorn app.main:app --reload --port 5000
```

The API will be available at `http://localhost:5000`

## API Documentation

- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login and get token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |

### Tasks (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all user tasks |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |

## Request/Response Examples

### Signup

**Request:**
```json
POST /auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login

**Request:**
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Protected Requests

Include the token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ User-scoped data access
- ✅ Input validation with Pydantic
- ✅ Proper HTTP status codes
- ✅ CORS configuration
- ✅ Centralized error handling

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── core/
│   │   ├── config.py        # Environment configuration
│   │   └── security.py      # JWT & password utilities
│   ├── db/
│   │   ├── base.py          # SQLAlchemy base
│   │   ├── session.py       # Database session
│   │   └── models.py        # Database models
│   ├── schemas/
│   │   ├── auth.py          # Auth Pydantic schemas
│   │   └── task.py          # Task Pydantic schemas
│   ├── routes/
│   │   ├── auth.py          # Auth endpoints
│   │   └── tasks.py         # Task endpoints
│   ├── services/
│   │   ├── auth_service.py  # Auth business logic
│   │   └── task_service.py  # Task business logic
│   ├── dependencies/
│   │   └── auth.py          # JWT middleware
│   └── utils/
│       └── exceptions.py    # Error handlers
├── .env.example
├── requirements.txt
└── README.md
```
