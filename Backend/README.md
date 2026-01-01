# PortfoLens Backend API

Express.js backend for PortfoLens - a mutual fund portfolio analysis platform.

## 🚀 Quick Start

```bash
cd Backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

## 🔒 Security Features

This backend implements comprehensive security hardening for production deployment:

### Rate Limiting

| Endpoint Type                       | Limit        | Window     |
| ----------------------------------- | ------------ | ---------- |
| Global (all routes)                 | 200 requests | 15 minutes |
| Auth routes (`/api/auth/*`)         | 20 requests  | 15 minutes |
| Analysis routes (`/api/analysis/*`) | 30 requests  | 15 minutes |

Rate limit headers are included in responses:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Time when limit resets

### Security Headers

Helmet.js is configured with secure defaults:

- Content Security Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security (HSTS)

### CORS Policy

- **Development**: Allows `http://localhost:5173` (Vite default)
- **Production**: Set `CORS_ORIGIN` env var to your frontend domain
- No wildcard (`*`) allowed - explicit origin required

### Input Validation

All API inputs are validated using Zod schemas:

- Type checking and coercion
- String length limits
- Email format validation
- MongoDB ObjectId format validation
- NoSQL injection prevention (blocks `$` operators in queries)

### JWT Security

- **No fallback secret**: Server won't start without `JWT_SECRET`
- **Algorithm**: HS256 only (prevents algorithm confusion attacks)
- **Default expiry**: 1 day (configurable via `JWT_EXPIRES_IN`)
- **httpOnly cookies**: Tokens stored securely (when applicable)

### Abuse Prevention

| Resource            | Limit |
| ------------------- | ----- |
| Portfolios per user | 5     |
| Funds per portfolio | 20    |
| SIPs per fund       | 10    |
| Request body size   | 1 MB  |

## 📋 Environment Variables

### Required

| Variable                     | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| `JWT_SECRET`                 | Secret key for JWT signing (min 32 chars recommended) |
| `MONGODB_URI` or `MONGO_URI` | MongoDB connection string                             |
| `GOOGLE_CLIENT_ID`           | Google OAuth client ID                                |
| `GOOGLE_CLIENT_SECRET`       | Google OAuth client secret                            |

### Optional

| Variable              | Default                   | Description                          |
| --------------------- | ------------------------- | ------------------------------------ |
| `PORT`                | 5000                      | Server port                          |
| `NODE_ENV`            | development               | Environment (development/production) |
| `CORS_ORIGIN`         | http://localhost:5173     | Allowed CORS origin                  |
| `JWT_EXPIRES_IN`      | 1d                        | JWT token expiry                     |
| `GOOGLE_CALLBACK_URL` | /api/auth/google/callback | OAuth callback path                  |

## 🏗️ Project Structure

```
src/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── env.config.js      # Environment validation
│   └── limits.config.js   # Abuse prevention limits
├── controllers/           # Route handlers
├── middleware/
│   ├── auth.middleware.js # JWT verification
│   ├── security.middleware.js # Rate limiting, sanitization
│   └── validation.schemas.js  # Zod validation schemas
├── models/               # Mongoose schemas
├── routes/               # API route definitions
├── services/             # Business logic
├── utils/                # Helpers (jwt, oauth, etc.)
├── app.js                # Express app setup
└── server.js             # Server entry point
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/google` - Google OAuth initiate
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/google/token` - Exchange Google token

### Portfolios

- `GET /api/portfolios` - List user's portfolios
- `POST /api/portfolios` - Create portfolio
- `GET /api/portfolios/:id` - Get portfolio details
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio
- `POST /api/portfolios/:id/funds` - Add fund to portfolio

### Analysis

- `GET /api/analysis/:portfolioId/summary` - Portfolio analysis

### Health

- `GET /api/health` - Health check

## ⚠️ Demo Mode Notice

This application includes **simulated market data** for demonstration purposes:

- NAV values are generated, not live market data
- Analysis insights are illustrative examples
- Do not use for actual investment decisions

## 🔧 Development

```bash
# Run in development mode (with nodemon)
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## 📦 Dependencies

### Core

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT handling
- `passport` / `passport-google-oauth20` - OAuth

### Security

- `helmet` - Security headers
- `cors` - CORS handling
- `express-rate-limit` - Rate limiting
- `zod` - Input validation
- `bcrypt` - Password hashing

### Utilities

- `dotenv` - Environment variables
- `morgan` - Request logging

## 📄 License

MIT
