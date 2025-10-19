# Authentication System Overview

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐                    ┌──────────────────┐    │
│  │  Login Page    │                    │  Register Page   │    │
│  │  /login        │                    │  /registro       │    │
│  └────────────────┘                    └──────────────────┘    │
│         │                                        │              │
│         │  email, senha                          │  user data   │
│         ▼                                        ▼              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Auth Context (useAuth)                           │  │
│  │  - Stores JWT token in localStorage                      │  │
│  │  - Fetches user data from /me endpoint                   │  │
│  │  - Provides login/logout functions                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ HTTP/HTTPS
                               │ Authorization: Bearer <token>
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                      BACKEND (Express.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Security Middleware Layer                                 │ │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌────────────┐ │ │
│  │  │  Helmet  │ │   CORS   │ │Rate Limiter│ │   Logger   │ │ │
│  │  └──────────┘ └──────────┘ └────────────┘ └────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Authentication Routes                                     │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐│ │
│  │  │ POST /login    │  │ POST /register │  │  GET /me     ││ │
│  │  │ (rate limited) │  │ (rate limited) │  │ (protected)  ││ │
│  │  └────────────────┘  └────────────────┘  └──────────────┘│ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Controllers                                               │ │
│  │  ┌──────────────────┐  ┌────────────────────────────────┐│ │
│  │  │AuthenticateCtrl  │  │     RegisterController         ││ │
│  │  │- Validate input  │  │  - Validate input (Zod)        ││ │
│  │  │- Check password  │  │  - Check email uniqueness      ││ │
│  │  │- Generate JWT    │  │  - Hash password (bcrypt)      ││ │
│  │  └──────────────────┘  │  - Create user                 ││ │
│  │                         └────────────────────────────────┘│ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Use Cases (Business Logic)                               │ │
│  │  ┌──────────────────┐  ┌────────────────────────────────┐│ │
│  │  │AuthenticateUseCase│  │     RegisterUseCase            ││ │
│  │  │- Compare password│  │  - Validate business rules     ││ │
│  │  │- Return user     │  │  - Create Usuario entity       ││ │
│  │  └──────────────────┘  └────────────────────────────────┘│ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Repositories (Data Access)                                │ │
│  │  ┌────────────────────────────────────────────────────────┐│ │
│  │  │      PrismaUsuariosRepository                          ││ │
│  │  │  - findByEmail(email)                                  ││ │
│  │  │  - create(usuario)                                     ││ │
│  │  │  - findById(id)                                        ││ │
│  │  └────────────────────────────────────────────────────────┘│ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │  PostgreSQL DB     │
                    │  (Prisma ORM)      │
                    └────────────────────┘
```

## Security Features

### 🔒 Backend Security

| Feature | Implementation | Status |
|---------|---------------|--------|
| **Environment Validation** | Zod schema validation for all env vars | ✅ |
| **JWT Authentication** | Sign/verify tokens with configurable expiry | ✅ |
| **Password Hashing** | bcrypt with salt rounds | ✅ |
| **Rate Limiting** | 5 req/15min for auth, 100 req/15min general | ✅ |
| **CORS Protection** | Configurable allowed origins | ✅ |
| **Security Headers** | Helmet middleware (XSS, CSP, etc.) | ✅ |
| **Input Validation** | Zod schemas for all requests | ✅ |
| **Password Requirements** | Min 8 chars, upper, lower, number | ✅ |

### 🔐 Frontend Security

| Feature | Implementation | Status |
|---------|---------------|--------|
| **Environment Config** | Centralized env.ts file | ✅ |
| **Password Strength** | Real-time strength indicator | ✅ |
| **Client Validation** | Pre-submit validation | ✅ |
| **Loading States** | Prevent double submissions | ✅ |
| **Error Handling** | User-friendly error messages | ✅ |
| **Token Management** | Auto-logout on invalid token | ✅ |

## Authentication Flow

### Registration Flow

```
User enters data → Client-side validation → POST /register
                                                    ↓
                                        Zod validation
                                                    ↓
                                        Check email unique
                                                    ↓
                                        Hash password
                                                    ↓
                                        Create user in DB
                                                    ↓
                                        Return 201 Created
                                                    ↓
                                        Redirect to /login
```

### Login Flow

```
User enters credentials → POST /login
                              ↓
                    Zod validation
                              ↓
                    Find user by email
                              ↓
                    Compare password hash
                              ↓
                    Generate JWT token
                              ↓
                    Return token
                              ↓
        Store in localStorage & fetch user data
                              ↓
                    Redirect to home
```

### Protected Route Access

```
User requests protected page → Check localStorage for token
                                        ↓
                          Token exists? ──No──→ Redirect to /login
                                        ↓
                                       Yes
                                        ↓
                          Add Authorization header
                                        ↓
                          GET /me (with token)
                                        ↓
                          Verify token (backend)
                                        ↓
                          Return user data
                                        ↓
                          Render protected page
```

## Password Requirements

| Requirement | Backend Validation | Frontend Validation | Visual Indicator |
|-------------|-------------------|---------------------|------------------|
| Min 8 characters | ✅ Zod | ✅ Before submit | ✅ Real-time |
| Uppercase letter | ✅ Regex | ✅ Before submit | ✅ Real-time |
| Lowercase letter | ✅ Regex | ✅ Before submit | ✅ Real-time |
| Number | ✅ Regex | ✅ Before submit | ✅ Real-time |
| Special char | ❌ Optional | ❌ Optional | ✅ Bonus points |

## Rate Limiting

### Authentication Endpoints (/login, /register)
- **Window**: 15 minutes
- **Max Requests**: 5 per IP
- **Response**: 429 Too Many Requests
- **Message**: "Muitas tentativas de autenticação. Tente novamente em 15 minutos."

### General Endpoints
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Response**: 429 Too Many Requests

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development          # development | production | test
PORT=3001                     # Server port
DATABASE_URL=postgresql://... # Database connection
JWT_SECRET=<64-char-secret>   # Must be 32+ characters
JWT_EXPIRES_IN=1d            # Token expiration
CORS_ORIGIN=http://localhost:3000  # Allowed origins
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001  # Backend API URL
```

## Error Handling

| Scenario | Backend Response | Frontend Handling |
|----------|-----------------|-------------------|
| Invalid email/password | 401 + generic message | Show error message |
| Email already exists | 409 + specific message | Show error message |
| Validation error | 400 + field details | Show field errors |
| Rate limit exceeded | 429 + wait message | Show error + disable form |
| Invalid token | 401 + generic message | Auto-logout + redirect |
| Server error | 500 + generic message | Show generic error |

## Testing Checklist

- [ ] Register with valid data → Success
- [ ] Register with existing email → Error
- [ ] Register with weak password → Error
- [ ] Login with valid credentials → Success + token
- [ ] Login with invalid credentials → Error
- [ ] Login 6 times with wrong password → Rate limited
- [ ] Access /me without token → 401 error
- [ ] Access /me with valid token → User data
- [ ] Access /me with expired token → 401 error
- [ ] CORS from unauthorized origin → Blocked
- [ ] Password strength indicator → Updates in real-time

## Files Modified/Created

### Backend
```
backend/
├── src/infra/
│   ├── config/
│   │   └── env.ts                    # NEW: Environment validation
│   └── http/
│       ├── controllers/
│       │   ├── AuthenticateController.ts  # MODIFIED: Use env config
│       │   └── RegisterController.ts      # MODIFIED: Password validation
│       ├── middlewares/
│       │   ├── ensureAuthenticated.ts     # MODIFIED: Use env config
│       │   └── rateLimiter.ts            # NEW: Rate limiting
│       ├── routes/
│       │   └── auth.routes.ts            # MODIFIED: Add rate limiter
│       └── server.ts                     # MODIFIED: Add security middleware
├── .env.example                          # MODIFIED: Add new vars
├── eslint.config.js                      # MODIFIED: Add node globals
└── package.json                          # MODIFIED: Add helmet, rate-limit
```

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── _login/
│   │   │   └── page.tsx                 # MODIFIED: Add loading states
│   │   └── _registro/
│   │       └── page.tsx                 # MODIFIED: Add password strength
│   ├── contexts/
│   │   └── auth-context.tsx             # MODIFIED: Use env config
│   └── lib/
│       └── env.ts                        # NEW: Environment config
└── .env.example                          # NEW: API URL config
```

### Documentation
```
/
├── SECURITY.md                           # NEW: Security guidelines
├── AUTHENTICATION_SETUP.md               # NEW: Setup instructions
└── AUTHENTICATION_OVERVIEW.md            # NEW: This file
```

## Next Steps (Optional Improvements)

### Short Term
- [ ] Add email verification
- [ ] Implement "forgot password" flow
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Implement refresh tokens

### Medium Term
- [ ] Move tokens to httpOnly cookies
- [ ] Add CSRF protection
- [ ] Implement session management
- [ ] Add 2FA support

### Long Term
- [ ] Add Redis for distributed rate limiting
- [ ] Implement audit logging
- [ ] Add anomaly detection
- [ ] Set up automated security scans

## Resources

- [SECURITY.md](SECURITY.md) - Security best practices
- [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) - Setup guide
- [Backend README](backend/README.md) - Backend documentation
- [Frontend README](frontend/README.md) - Frontend documentation
