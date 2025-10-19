# Authentication System Setup Guide

This guide walks you through setting up and testing the secure login system.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Docker (optional, for database)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Important Environment Variables:**

```env
# Database connection
DATABASE_URL="postgresql://user:password@localhost:5432/aquario?schema=public"

# JWT Secret - Generate a secure secret:
# openssl rand -base64 64
JWT_SECRET="your-very-secure-secret-key-with-at-least-32-characters"

# JWT expiration time (1d = 1 day, 7d = 7 days, etc.)
JWT_EXPIRES_IN="1d"

# CORS - Frontend URL(s) separated by commas
CORS_ORIGIN="http://localhost:3000"

# Server port
PORT="3001"

# Environment
NODE_ENV="development"
```

**Run Database Migrations:**

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed database with sample data
npm run db:seed
```

**Start Backend:**

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

Backend will be available at `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables (optional, defaults are fine for local dev)
cp .env.example .env.local

# Edit if needed
nano .env.local
```

**Environment Variables (optional):**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Start Frontend:**

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Frontend will be available at `http://localhost:3000`

## Testing the Authentication System

### 1. Register a New User

1. Navigate to `http://localhost:3000/registro`
2. Fill in the registration form:
   - **Nome**: Your full name
   - **Email**: A valid email address
   - **Senha**: Must meet requirements:
     - At least 8 characters
     - One uppercase letter (A-Z)
     - One lowercase letter (a-z)
     - One number (0-9)
   - **Você é?**: Select DISCENTE (Student) or DOCENTE (Teacher)
   - **Centro**: Select your academic center
   - **Curso**: Select your course (if DISCENTE)

3. Watch for the password strength indicator
4. Click "Registrar"
5. You should be redirected to the login page

### 2. Login

1. Navigate to `http://localhost:3000/login`
2. Enter your email and password
3. Click "Entrar"
4. You should be redirected to the home page
5. Your authentication token is stored in localStorage

### 3. Access Protected Routes

Protected routes require authentication. For example:
- Profile page: `http://localhost:3000/perfil`
- Create new post: `http://localhost:3000/blog/novo`

If you're not logged in, you'll be redirected to the login page.

### 4. Test Security Features

#### Rate Limiting

Try logging in with wrong credentials 6 times rapidly:
- After 5 attempts, you should receive: "Muitas tentativas de autenticação. Tente novamente em 15 minutos."

#### Password Validation

Try registering with weak passwords:
- Less than 8 characters: Error message
- No uppercase: Error message
- No lowercase: Error message
- No number: Error message

#### CORS Protection

Try accessing the API from a different origin:
```bash
# This should fail if CORS_ORIGIN doesn't include the origin
curl -H "Origin: http://evil-site.com" \
     -H "Content-Type: application/json" \
     -X POST \
     -d '{"email":"test@test.com","senha":"password"}' \
     http://localhost:3001/login
```

## API Endpoints

### Authentication Endpoints

#### POST /login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "senha": "SecurePass123"
}
```

**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error):**
```json
{
  "message": "E-mail ou senha inválidos."
}
```

#### POST /register
Register a new user.

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "SecurePass123",
  "papel": "DISCENTE",
  "centroId": "uuid-of-centro",
  "cursoId": "uuid-of-curso",
  "periodo": 3
}
```

**Response (Success):**
- HTTP 201 Created

**Response (Error):**
```json
{
  "message": "Este e-mail já está em uso.",
  "issues": { /* Zod validation errors */ }
}
```

#### GET /me
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@example.com",
  "papel": "DISCENTE",
  "centro": {
    "id": "uuid",
    "nome": "Centro de Informática",
    "sigla": "CI"
  },
  "curso": {
    "id": "uuid",
    "nome": "Ciência da Computação"
  },
  "periodo": 3,
  "bio": null,
  "urlFotoPerfil": null,
  "permissoes": []
}
```

## Troubleshooting

### "Invalid environment variables"
- Check that your `.env` file exists in the backend directory
- Ensure `JWT_SECRET` is at least 32 characters
- Verify `DATABASE_URL` is properly formatted

### "CORS error"
- Check that `CORS_ORIGIN` includes your frontend URL
- Multiple origins should be comma-separated
- No trailing slashes in URLs

### "Cannot connect to database"
- Ensure PostgreSQL is running
- Check database credentials in `DATABASE_URL`
- Run migrations: `npm run db:migrate`

### "Rate limit exceeded"
- Wait 15 minutes
- Or restart the backend server (development only)

### Token issues
- Clear localStorage: `localStorage.clear()` in browser console
- Check that JWT_SECRET matches between requests
- Verify token hasn't expired

## Security Checklist for Production

Before deploying to production:

- [ ] Generate a new, secure JWT_SECRET (64+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS_ORIGIN (your production domain)
- [ ] Enable HTTPS/SSL
- [ ] Set secure, httpOnly cookies for tokens
- [ ] Configure database with SSL
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting with Redis (for multi-server)
- [ ] Review and test all authentication flows
- [ ] Set up automated backups
- [ ] Configure firewall rules
- [ ] Enable database connection pooling
- [ ] Review and update all dependencies

## Additional Resources

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Security Guidelines](SECURITY.md)
- [Contributing Guidelines](README.md#como-contribuir)
