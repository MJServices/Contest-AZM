# DecorVista Technical Specifications

## 1. Technology Stack Details

### 1.1 Frontend Technologies
- **React.js 18+**: Main UI framework
- **React Router v6**: Client-side routing
- **Context API**: State management
- **Axios**: HTTP client for API calls
- **CSS3 + CSS Modules**: Styling approach
- **React Hook Form**: Form handling and validation
- **React Query**: Server state management and caching
- **Framer Motion**: Animations and transitions
- **React Dropzone**: File upload handling
- **React Image Gallery**: Image carousel component

### 1.2 Backend Technologies
- **Node.js 18+**: Runtime environment
- **Express.js 4+**: Web application framework
- **MySQL 8.0+**: Primary database
- **Sequelize ORM**: Database object-relational mapping
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Multer**: File upload middleware
- **Sharp**: Image processing
- **Nodemailer**: Email sending
- **Express Rate Limit**: API rate limiting
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

### 1.3 Development Tools
- **Vite**: Frontend build tool
- **ESLint + Prettier**: Code formatting and linting
- **Jest**: Testing framework
- **Postman**: API testing
- **Git**: Version control
- **VS Code**: Development environment

## 2. Project Structure

### 2.1 Backend Structure
```
decorvista-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── upload.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── consultationController.js
│   │   ├── reviewController.js
│   │   ├── galleryController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── upload.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── UserDetails.js
│   │   ├── InteriorDesigner.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Consultation.js
│   │   ├── Review.js
│   │   ├── SavedDesign.js
│   │   └── CartItem.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── consultations.js
│   │   ├── reviews.js
│   │   ├── gallery.js
│   │   └── admin.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── emailService.js
│   │   ├── imageService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   └── app.js
├── uploads/
│   ├── profiles/
│   ├── products/
│   ├── gallery/
│   └── portfolios/
├── tests/
├── package.json
└── server.js
```

### 2.2 Frontend Structure
```
decorvista-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   ├── Modal/
│   │   │   └── LoadingSpinner/
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   └── ProtectedRoute/
│   │   ├── dashboard/
│   │   │   ├── UserDashboard/
│   │   │   ├── DesignerDashboard/
│   │   │   └── AdminDashboard/
│   │   ├── products/
│   │   │   ├── ProductCatalog/
│   │   │   ├── ProductCard/
│   │   │   ├── ProductDetails/
│   │   │   └── SearchFilters/
│   │   ├── gallery/
│   │   │   ├── InspirationGallery/
│   │   │   ├── ImageGrid/
│   │   │   └── SavedDesigns/
│   │   ├── consultations/
│   │   │   ├── BookingForm/
│   │   │   ├── DesignerList/
│   │   │   └── TimeSlotPicker/
│   │   ├── cart/
│   │   │   ├── ShoppingCart/
│   │   │   └── CartItem/
│   │   └── reviews/
│   │       ├── ReviewForm/
│   │       └── ReviewList/
│   ├── pages/
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Contact/
│   │   ├── Products/
│   │   ├── Gallery/
│   │   ├── Designers/
│   │   └── Dashboard/
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useCart.js
│   │   └── useLocalStorage.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── utils.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── CartContext.js
│   │   └── ThemeContext.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── components/
│   └── App.js
├── package.json
└── vite.config.js
```

## 3. API Endpoints Documentation

### 3.1 Authentication Endpoints

#### POST /api/v1/auth/register
**Description**: Register a new user account
**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user|designer",
  "firstName": "string",
  "lastName": "string",
  "contactNumber": "string"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "number",
    "email": "string",
    "verificationRequired": true
  }
}
```

#### POST /api/v1/auth/login
**Description**: Authenticate user and return JWT token
**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string",
    "refreshToken": "string",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string",
      "role": "string"
    }
  }
}
```

### 3.2 Product Endpoints

#### GET /api/v1/products
**Description**: Get paginated list of products with filters
**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Category ID
- `search`: Search term
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `brand`: Brand name
- `sortBy`: Sort field (price, name, created_at)
- `sortOrder`: Sort direction (asc, desc)

**Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": "number",
        "productName": "string",
        "brand": "string",
        "price": "number",
        "description": "string",
        "images": ["string"],
        "category": {
          "categoryId": "number",
          "categoryName": "string"
        },
        "isAvailable": "boolean"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number",
      "hasNext": "boolean",
      "hasPrev": "boolean"
    }
  }
}
```

#### GET /api/v1/products/:id
**Description**: Get detailed product information
**Response**:
```json
{
  "success": true,
  "data": {
    "productId": "number",
    "productName": "string",
    "brand": "string",
    "price": "number",
    "description": "string",
    "images": ["string"],
    "dimensions": "string",
    "materials": "string",
    "color": "string",
    "style": "string",
    "category": {
      "categoryId": "number",
      "categoryName": "string"
    },
    "reviews": [
      {
        "reviewId": "number",
        "rating": "number",
        "comment": "string",
        "userName": "string",
        "createdAt": "string"
      }
    ],
    "averageRating": "number",
    "reviewCount": "number"
  }
}
```

### 3.3 Consultation Endpoints

#### POST /api/v1/consultations/book
**Description**: Book a consultation with a designer
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "designerId": "number",
  "scheduledDatetime": "string",
  "consultationType": "virtual|in_person",
  "projectBrief": "string",
  "duration": "number"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Consultation booked successfully",
  "data": {
    "consultationId": "number",
    "status": "pending",
    "scheduledDatetime": "string",
    "designer": {
      "designerId": "number",
      "firstName": "string",
      "lastName": "string"
    }
  }
}
```

#### GET /api/v1/consultations/user/:userId
**Description**: Get user's consultation history
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "consultationId": "number",
      "scheduledDatetime": "string",
      "status": "string",
      "consultationType": "string",
      "designer": {
        "designerId": "number",
        "firstName": "string",
        "lastName": "string",
        "specialization": "string"
      },
      "projectBrief": "string",
      "notes": "string"
    }
  ]
}
```

### 3.4 Review Endpoints

#### POST /api/v1/reviews
**Description**: Submit a review for product or designer
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "productId": "number", // Optional
  "designerId": "number", // Optional
  "consultationId": "number", // Optional
  "rating": "number", // 1-5
  "comment": "string"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "reviewId": "number",
    "rating": "number",
    "comment": "string",
    "createdAt": "string"
  }
}
```

### 3.5 File Upload Endpoints

#### POST /api/v1/uploads/image
**Description**: Upload image file
**Headers**: `Authorization: Bearer <token>`
**Content-Type**: `multipart/form-data`
**Request Body**: Form data with `image` field
**Response**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "filename": "string",
    "originalName": "string",
    "url": "string",
    "thumbnailUrl": "string",
    "size": "number"
  }
}
```

## 4. Database Configuration

### 4.1 Connection Configuration
```javascript
// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'decorvista_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
```

### 4.2 Model Associations
```javascript
// models/associations.js
const User = require('./User');
const UserDetails = require('./UserDetails');
const InteriorDesigner = require('./InteriorDesigner');
const Product = require('./Product');
const Category = require('./Category');
const Consultation = require('./Consultation');
const Review = require('./Review');

// User associations
User.hasOne(UserDetails, { foreignKey: 'userId' });
User.hasOne(InteriorDesigner, { foreignKey: 'userId' });
User.hasMany(Consultation, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });

// Product associations
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.hasMany(Review, { foreignKey: 'productId' });

// Designer associations
InteriorDesigner.hasMany(Consultation, { foreignKey: 'designerId' });
InteriorDesigner.hasMany(Review, { foreignKey: 'designerId' });

// Consultation associations
Consultation.belongsTo(User, { foreignKey: 'userId' });
Consultation.belongsTo(InteriorDesigner, { foreignKey: 'designerId' });
Consultation.hasMany(Review, { foreignKey: 'consultationId' });
```

## 5. Security Implementation

### 5.1 Authentication Middleware
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or inactive user' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};
```

### 5.2 Input Validation
```javascript
// middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('username').isLength({ min: 3, max: 30 }).isAlphanumeric(),
  body('firstName').isLength({ min: 1, max: 50 }).trim(),
  body('lastName').isLength({ min: 1, max: 50 }).trim(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];
```

## 6. Performance Optimization

### 6.1 Caching Strategy
```javascript
// services/cacheService.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default

const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.sendResponse(body);
    };
    
    next();
  };
};
```

### 6.2 Image Optimization
```javascript
// services/imageService.js
const sharp = require('sharp');
const path = require('path');

const processImage = async (inputPath, outputDir, filename) => {
  const sizes = [
    { suffix: '_thumb', width: 150, height: 150 },
    { suffix: '_medium', width: 500, height: 500 },
    { suffix: '_large', width: 1200, height: 1200 }
  ];

  const processedImages = {};

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${filename}${size.suffix}.webp`);
    
    await sharp(inputPath)
      .resize(size.width, size.height, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(outputPath);
      
    processedImages[size.suffix.substring(1)] = outputPath;
  }

  return processedImages;
};
```

## 7. Error Handling

### 7.1 Global Error Handler
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};
```

## 8. Testing Strategy

### 8.1 Unit Testing Example
```javascript
// tests/controllers/authController.test.js
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
    });
  });
});
```

This technical specification provides a comprehensive guide for implementing the DecorVista application with all the necessary technical details, configurations, and best practices.