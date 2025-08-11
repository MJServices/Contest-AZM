# DecorVista - Home Interior Design Web Application

A comprehensive web application for home interior design that connects homeowners with professional interior designers, featuring product catalogs, inspiration galleries, and consultation booking services.

## 🏗️ Architecture

- **Frontend**: React.js with responsive design
- **Backend**: Node.js with Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based with refresh tokens
- **Email**: Nodemailer for notifications

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd decorvista
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=decorvista_db
   DB_USER=root
   DB_PASSWORD=your_password
   
   # JWT Secrets (generate strong secrets for production)
   JWT_SECRET=your_super_secret_jwt_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_key
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Database Setup**
   ```sql
   CREATE DATABASE decorvista_db;
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "contactNumber": "+1234567890",
  "role": "user"
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Verify Email
```http
GET /api/v1/auth/verify-email/{token}
```

#### Request Password Reset
```http
POST /api/v1/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "NewSecurePass123"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

#### Get Profile (Protected)
```http
GET /api/v1/auth/profile
Authorization: Bearer {access_token}
```

#### Logout (Protected)
```http
POST /api/v1/auth/logout
Authorization: Bearer {access_token}
```

## 🔧 Development

### Project Structure
```
decorvista/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   └── app.js          # Express app setup
├── server.js           # Server entry point
├── package.json        # Dependencies
└── README.md          # This file
```

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | Database name | `decorvista_db` |
| `DB_USER` | Database user | `root` |
| `DB_PASSWORD` | Database password | `` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Required |
| `JWT_EXPIRE` | JWT expiration | `24h` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | `7d` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | Required |
| `EMAIL_PASS` | SMTP password | Required |
| `FRONTEND_URL` | Frontend URL | `http://localhost:3000` |

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin policies
- **Security Headers**: Helmet.js security headers
- **Email Verification**: Required email verification for new accounts

## 🧪 Testing

### Manual Testing with cURL

#### Register a new user:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "role": "user"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

#### Get profile (replace TOKEN with actual token):
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Email Not Sending**
   - Check email configuration in `.env`
   - For Gmail, use App Password instead of regular password
   - Verify SMTP settings

3. **JWT Token Issues**
   - Ensure JWT secrets are set in `.env`
   - Check token expiration settings
   - Verify token format in Authorization header

4. **CORS Errors**
   - Check `FRONTEND_URL` in `.env`
   - Verify allowed origins in `src/app.js`

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 📝 API Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## 🔄 Development Status

### ✅ Completed Features
- [x] Project setup and configuration
- [x] Database design and models
- [x] User authentication system
- [x] Email verification
- [x] Password reset functionality
- [x] JWT token management
- [x] Input validation and security
- [x] Error handling
- [x] API documentation

### 🚧 In Progress
- [ ] User management system
- [ ] Product catalog
- [ ] Consultation booking
- [ ] Review system
- [ ] File upload system

### 📋 Planned Features
- [ ] Frontend React application
- [ ] Admin panel
- [ ] Payment integration
- [ ] Real-time notifications
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@decorvista.com

---

**DecorVista** - Transforming homes, one design at a time. 🏠✨