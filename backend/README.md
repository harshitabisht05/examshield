# ExamShield Backend

This folder contains the backend API for the ExamShield application. It is built with Node.js, Express, and MySQL, and includes authentication, RBAC, exam creation, question management, exam submission, scoring, results, activity logging, and basic security protections.

## Tech Stack

- Node.js
- Express
- MySQL / MariaDB
- `mysql2`
- `jsonwebtoken` for JWT auth
- `bcrypt` for password hashing
- `dotenv` for environment configuration
- `multer` for CSV upload handling
- `jest` + `supertest` for backend tests

## Features

### Authentication & Authorization

- User registration (`admin`, `examiner`, `student` roles)
- Login with JWT
- Role-based access control
- Protected API routes using JWT middleware
- Rate limiting for general API usage and authentication endpoints

### Exam & Question Management

- Create exams as an `examiner`
- Add MCQ and subjective questions to exams
- Bulk upload questions through CSV files
- List all exams and list exams created by the authenticated examiner
- Fetch questions for an exam with:
  - randomized question order
  - MCQ answer option shuffling

### Submission & Results

- Students can submit exam answers
- Prevent duplicate submissions for the same exam
- Automatic scoring for MCQ answers
- Store responses and results
- Students can view their own exam results
- Examiners can view results for an exam and specific student results
- Examiners can manually grade / update result scores

### Activity Logging

- Log custom user actions via `/api/logs/event`
- Users can fetch their own logs
- Admins can fetch logs for any user

### Security & Performance

- CORS support
- Basic security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`)
- Request body size limit
- Connection pooling for MySQL
- Rate limiting middleware

## Environment Variables

Create a `.env` file in the `backend/` directory with values similar to:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=examshield_user
DB_PASSWORD=ExamShield@123
DB_NAME=examshield
JWT_SECRET=ExamShieldSecret123
JWT_EXPIRES_IN=1h
ALLOWED_ORIGINS=http://localhost:3000
DB_CONNECTION_LIMIT=10
```

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create the MySQL database and tables:

- Use `backend/db.sql` to initialize the database schema.
- Example:

```bash
mysql -u root -p < backend/db.sql
```

3. Start the backend server:

```bash
cd backend
node server.js
```

The server listens on `http://localhost:5000`.

## API Endpoints

### Auth

- `POST /api/auth/register`
  - Body: `{ name, email, password, role }`
- `POST /api/auth/login`
  - Body: `{ email, password }`

### Exams

- `POST /api/exam/create` (examiner only)
  - Body: `{ title, duration }`
- `POST /api/exam/add-question` (examiner only)
  - Body: `{ exam_id, type, question, optionA, optionB, optionC, optionD, correct_answer }`
- `GET /api/exam/` (authenticated)
  - List all exams
- `GET /api/exam/mine` (examiner only)
  - List exams created by the authenticated examiner
- `GET /api/exam/:exam_id` (authenticated)
  - Retrieve exam questions with randomization
- `POST /api/exam/submit` (student only)
  - Body: `{ exam_id, answers }`
- `POST /api/exam/bulk-upload` (examiner only)
  - `multipart/form-data` upload of CSV file under field name `file`

### Results

- `GET /api/results/student/all` (student only)
  - Get all results for the authenticated student
- `GET /api/results/exam/:exam_id` (examiner only)
  - Get results for a specific exam
- `GET /api/results/exam/:exam_id/student/:student_id` (authenticated)
  - Get a specific student result; examiners or the matching student only
- `POST /api/results/grade` (examiner only)
  - Body: `{ result_id, score }`

### Logs

- `POST /api/logs/event` (authenticated)
  - Body: `{ action, metadata }`
- `GET /api/logs/me` (authenticated)
  - Get logs for the authenticated user
- `GET /api/logs/user/:user_id` (admin only)
  - Get logs for a specific user

### Health

- `GET /health`
  - Returns API status and database connection state

## Testing

Run the backend tests using:

```bash
cd backend
npm test -- --runInBand
```

### Example test output

```bash
> backend@1.0.0 test
> jest --runInBand

PASS  tests/health.test.js
  ExamShield backend
    ✓ should respond to root health check (xx ms)
    ✓ should expose /health endpoint (xx ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

## Usage Examples

### Health check

```bash
curl http://localhost:5000/health
```

### Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "strongpassword",
    "role": "student"
  }'
```

### Login and get a JWT token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "strongpassword"
  }'
```

### Use the JWT token for an authenticated request

```bash
TOKEN="<your-jwt-token>"
curl http://localhost:5000/api/exam/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Notes

- The backend uses a simple in-memory rate limiter; for production, replace it with a distributed solution.
- CSV bulk upload expects the following headers: `exam_id,type,question,optionA,optionB,optionC,optionD,correct_answer`.
- JWT authentication is required for all protected endpoints.

## Directory structure

- `server.js` — Express application entrypoint
- `db.js` — MySQL connection pool
- `db.sql` — schema definition and indexes
- `routes/` — API route definitions
- `controllers/` — auth controller logic
- `middleware/` — auth, roles, rate limiting, validation utilities
- `models/` — database access layer
- `tests/` — Jest / Supertest tests
