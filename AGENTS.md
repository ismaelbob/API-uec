# AGENTS.md - API-UEC Development Guide

## Project Overview
- **Type**: Express.js REST API with MongoDB (Mongoose)
- **Language**: JavaScript (CommonJS)
- **Port**: 3000 (default)

## Commands

### Start Development Server
```bash
npm start
# or
node server.js
```

### Testing
- **No tests configured** - The current test script is a placeholder
- To add tests, consider using Jest or Mocha

### Linting
- **No linter configured** - Consider adding ESLint for code quality

## Code Style Guidelines

### General Conventions
- **ES Version**: ES2017+ (async/await support)
- **Module System**: CommonJS (`require()`/`module.exports`)
- **Indentation**: 2 spaces

### Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `user.routes.js` |
| Variables/Functions | camelCase | `createUser`, `authMiddleware` |
| Schema Fields | camelCase | `usuario`, `password`, `nombre` |
| Constants | UPPER_SNAKE_CASE | `JWT_SECRET` |
| Controllers | `{entity}.controller.js` | `user.controller.js` |
| Models | `{entity}.model.js` | `user.model.js` |
| Routes | `{entity}.routes.js` | `user.routes.js` |
| Middlewares | `{purpose}.middleware.js` | `auth.middleware.js` |
| Validators | `{entity}.validator.js` | `user.validator.js` |

### File Organization
```
src/
├── app.js              # Express app setup
├── config/             # Configuration (db, env)
├── controllers/        # Request handlers
├── middlewares/        # Express middlewares
├── models/             # Mongoose schemas
├── routes/             # Route definitions
├── services/           # Business logic
├── utils/              # Utility functions
└── validators/        # express-validator rules
```

### Import Order
1. Built-in Node modules (`express`, `fs`, etc.)
2. External packages (`mongoose`, `bcryptjs`, `jsonwebtoken`)
3. Internal modules (relative paths)

### Error Handling
- Use try/catch in async controllers
- Return consistent JSON response format:
```javascript
// Success
res.status(200).json({ ok: true, data: ... })

// Client error
res.status(400).json({ ok: false, message: '...' })

// Server error
res.status(500).json({ ok: false, message: 'Error del servidor' })
```

### Response Format Standard
All endpoints should return:
```javascript
{
  ok: boolean,        // true/false
  message?: string,  // human-readable message
  data?: any          // optional payload
}
```

### Auth & Security
- JWT tokens with `Bearer` prefix in Authorization header
- Passwords hashed with bcrypt (salt rounds: 10)
- Use environment variables for secrets (`.env`)
- Password validation: require different new password from current

### Database Patterns
- Use soft deletes (mark `activo: false`) instead of hard deletes
- Always exclude password from query results: `'-password'`
- Use `timestamps: true` in Mongoose schemas
- Add indexes for frequently queried fields

### Validation
- Use `express-validator` for input validation
- Create validator files per entity in `src/validators/`

### Middleware Pattern
```javascript
const middlewareName = (req, res, next) => {
  try {
    // logic
    next();
  } catch (error) {
    res.status(401).json({ ok: false, message: '...' });
  }
};
module.exports = middlewareName;
```

### Role-Based Access
- Levels defined in user model (`nivel` field)
- Use `requireRole(level)` middleware for authorization
- Level 1 = Admin, higher = elevated privileges

## API Endpoints Summary

### Auth (`/api/auth`)
- POST `/register` - Register user
- POST `/login` - Login (returns JWT)
- POST `/refresh` - Refresh token

### Users (`/api/users`)
- GET `/` - List users (paginated, searchable)
- GET `/:id` - Get user by ID
- POST `/` - Create user (admin only)
- PUT `/:id` - Update user
- PUT `/change-password` - Change password
- DELETE `/:id` - Soft delete user (admin only)
- PATCH `/:id/restore` - Restore user (admin only)
- GET `/admin/inactivos` - List inactive users

### Songs (`/api/songs`)
- Standard CRUD operations

## Environment Variables
Create a `.env` file with:
```
PORT=3000
DB_URI=mongodb://localhost:27017/api-uec
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```
