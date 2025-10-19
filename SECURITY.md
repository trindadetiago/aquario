# Security Guidelines

## Authentication and Security Implementation

This document describes the security features and best practices implemented in the Aquário authentication system.

## Backend Security Features

### 1. Environment Variable Validation

All sensitive configuration values are validated at startup using Zod schemas:

- `JWT_SECRET`: Must be at least 32 characters long
- `DATABASE_URL`: Required
- `CORS_ORIGIN`: Configurable, defaults to `http://localhost:3000`
- `JWT_EXPIRES_IN`: Token expiration time (default: 1d)

**Setup:**
```bash
cd backend
cp .env.example .env
# Edit .env and set appropriate values
```

**Important:** Never commit `.env` files to version control. Always use strong, randomly generated JWT secrets in production.

### 2. CORS Configuration

CORS is configured with specific origins to prevent unauthorized cross-origin requests:

```typescript
// Multiple origins can be specified, separated by commas
CORS_ORIGIN="http://localhost:3000,https://yourdomain.com"
```

### 3. Rate Limiting

Two rate limiters are implemented:

- **Authentication Rate Limiter**: 5 requests per 15 minutes per IP
  - Applied to `/login` and `/register` endpoints
  - Prevents brute force attacks

- **General Rate Limiter**: 100 requests per 15 minutes per IP
  - Applied to all routes
  - Prevents DoS attacks

### 4. HTTP Security Headers (Helmet)

Helmet middleware adds security-related HTTP headers:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security (in production)
- And more...

### 5. Password Security

**Hashing:**
- Passwords are hashed using bcrypt with a cost factor of 10
- Passwords are never stored in plain text

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### 6. JWT Token Security

**Features:**
- Tokens expire after 1 day (configurable)
- Tokens include user role and permissions
- Tokens are signed with a secure secret key
- Token verification on protected routes

**Token Structure:**
```json
{
  "papel": "DISCENTE",
  "permissoes": [],
  "sub": "user-id",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Frontend Security Features

### 1. Environment Variables

API URLs and other configuration use environment variables:

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local if needed
```

### 2. Password Strength Indicator

Real-time password strength feedback:
- Visual indicator (weak/medium/strong/very strong)
- Color-coded feedback
- Requirements checklist

### 3. Client-Side Validation

Before submitting to the API, the frontend validates:
- Email format
- Password strength requirements
- Required fields
- Form completeness

### 4. Loading States

Buttons are disabled during API calls to prevent:
- Multiple submissions
- Race conditions
- User confusion

### 5. Secure Token Storage

**Current Implementation:**
- Tokens stored in localStorage
- Token automatically included in API requests
- Auto-logout on invalid/expired tokens

**Production Recommendations:**
For additional security, consider:
- Using httpOnly cookies instead of localStorage
- Implementing refresh tokens
- Adding CSRF protection

## Security Best Practices

### For Developers

1. **Never commit secrets**
   - Use `.env` files for local development
   - Use secret management services in production
   - Keep `.env.example` updated with required variables

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Use HTTPS in production**
   - Configure SSL/TLS certificates
   - Redirect HTTP to HTTPS
   - Set `secure` flag on cookies

4. **Monitor and log**
   - Log authentication attempts
   - Monitor rate limit violations
   - Track suspicious activity

5. **Regular security reviews**
   - Review access permissions
   - Update dependencies
   - Check for security advisories

### For Administrators

1. **Strong JWT Secret**
   - Generate using: `openssl rand -base64 64`
   - Never reuse across environments
   - Rotate regularly

2. **Database Security**
   - Use strong database credentials
   - Enable SSL connections
   - Regular backups

3. **CORS Configuration**
   - Only allow trusted origins
   - Don't use wildcards in production

4. **Rate Limiting**
   - Adjust limits based on usage patterns
   - Consider IP whitelisting for APIs
   - Use Redis for distributed rate limiting

## Reporting Security Issues

If you discover a security vulnerability, please email the security team at:
- ralf.ferreira@academico.ufpb.br

**Do not** open public issues for security vulnerabilities.

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
