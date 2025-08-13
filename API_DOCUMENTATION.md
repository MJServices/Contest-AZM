# DecorVista API Documentation

## Overview

The DecorVista API provides comprehensive backend functionality for an interior design platform. This document outlines all available endpoints, their functionality, and usage examples.

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication (`/auth`)

#### POST `/auth/register`
Register a new user account.

**Body:**
```json
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

#### POST `/auth/login`
Login with email and password.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### GET `/auth/verify-email/:token`
Verify email address using verification token.

#### POST `/auth/resend-verification`
Resend email verification.

#### POST `/auth/request-password-reset`
Request password reset email.

#### POST `/auth/reset-password`
Reset password using reset token.

#### POST `/auth/refresh-token`
Refresh access token using refresh token.

#### POST `/auth/logout`
Logout user (requires authentication).

#### GET `/auth/profile`
Get current user profile (requires authentication).

### Profile Management (`/profile`)

#### GET `/profile`
Get user profile details (requires authentication).

#### PUT `/profile`
Update user profile (requires authentication).

#### POST `/profile/image`
Upload profile image (requires authentication).

#### DELETE `/profile/image`
Delete profile image (requires authentication).

#### POST `/profile/role-upgrade`
Request role upgrade to designer (requires authentication).

#### GET `/profile/pending-upgrades`
Get pending role upgrade requests (admin only).

#### POST `/profile/approve-upgrade/:userId`
Approve/reject role upgrade request (admin only).

### Gallery Management (`/gallery`)

#### GET `/gallery`
Get gallery items with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `category`: Filter by category
- `style`: Filter by style
- `search`: Search in title/description
- `featured`: Show only featured items (true/false)
- `sort`: Sort field (default: created_at)
- `order`: Sort order (ASC/DESC, default: DESC)

#### GET `/gallery/:id`
Get single gallery item by ID.

#### POST `/gallery`
Upload new gallery item (requires authentication).

#### PUT `/gallery/:id`
Update gallery item (owner or admin only).

#### DELETE `/gallery/:id`
Delete gallery item (owner or admin only).

#### POST `/gallery/:id/like`
Like/unlike gallery item (requires authentication).

#### GET `/gallery/user/:userId`
Get gallery items by specific user.

### Consultations (`/consultations`)

#### GET `/consultations`
Get user's consultations with filtering (requires authentication).

#### GET `/consultations/:id`
Get specific consultation by ID (requires authentication).

#### POST `/consultations`
Book new consultation (requires authentication).

#### PUT `/consultations/:id`
Update consultation details (requires authentication).

#### DELETE `/consultations/:id`
Cancel consultation (requires authentication).

#### GET `/consultations/designers/available`
Get available designers for consultation.

#### GET `/consultations/designers/:designerId/availability`
Get designer's availability for date range.

#### POST `/consultations/:id/rate`
Rate completed consultation (client only).

### Projects (`/projects`)

#### GET `/projects`
Get projects with filtering (requires authentication).

#### GET `/projects/stats`
Get project statistics (requires authentication).

#### GET `/projects/unassigned`
Get unassigned projects (designer/admin only).

#### GET `/projects/:id`
Get project by ID (requires authentication).

#### POST `/projects`
Create new project (requires authentication).

#### PUT `/projects/:id`
Update project (requires authentication).

#### DELETE `/projects/:id`
Delete project (owner or admin only).

#### POST `/projects/:id/assign`
Assign designer to project (designer self-assignment or admin).

#### POST `/projects/:id/submit`
Submit project for review (owner only).

### Reviews (`/reviews`)

#### GET `/reviews`
Get reviews with filtering.

#### GET `/reviews/featured`
Get featured reviews.

#### GET `/reviews/user/:userId`
Get reviews for specific user.

#### GET `/reviews/:id`
Get review by ID.

#### POST `/reviews`
Create new review (requires authentication).

#### PUT `/reviews/:id`
Update review (reviewer only).

#### DELETE `/reviews/:id`
Delete review (reviewer or admin).

#### POST `/reviews/:id/response`
Add response to review (reviewee only).

#### GET `/reviews/admin/pending`
Get pending reviews for moderation (admin only).

#### POST `/reviews/:id/moderate`
Moderate review - approve/reject/flag (admin only).

### Notifications (`/notifications`)

#### GET `/notifications`
Get user notifications (requires authentication).

#### GET `/notifications/count`
Get unread notification count (requires authentication).

#### GET `/notifications/stats`
Get notification statistics (requires authentication).

#### GET `/notifications/preferences`
Get notification preferences (requires authentication).

#### PUT `/notifications/preferences`
Update notification preferences (requires authentication).

#### POST `/notifications/mark-all-read`
Mark all notifications as read (requires authentication).

#### GET `/notifications/:id`
Get notification by ID (requires authentication).

#### POST `/notifications/:id/read`
Mark notification as read (requires authentication).

#### POST `/notifications/:id/archive`
Archive notification (requires authentication).

#### DELETE `/notifications/:id`
Delete notification (requires authentication).

#### POST `/notifications`
Create notification (admin only).

#### POST `/notifications/cleanup`
Clean up expired notifications (admin only).

### Admin Panel (`/admin`)

#### GET `/admin/dashboard`
Get comprehensive dashboard statistics (admin only).

#### GET `/admin/users`
Get all users with filtering (admin only).

#### PUT `/admin/users/:userId/status`
Update user status - activate/deactivate (admin only).

#### PUT `/admin/users/:userId/role`
Update user role (admin only).

#### GET `/admin/pending-approvals`
Get pending approvals for gallery, reviews, role upgrades (admin only).

#### POST `/admin/gallery/:id/moderate`
Moderate gallery item - approve/reject (admin only).

#### GET `/admin/activity-logs`
Get system activity logs (admin only).

#### POST `/admin/announcements`
Send system announcement to users (admin only).

#### GET `/admin/health`
Admin panel health check (admin only).

### Statistics (`/stats`)

#### GET `/stats/platform`
Get comprehensive platform statistics (admin only).

#### GET `/stats/dashboard`
Get user-specific dashboard statistics (requires authentication).

#### GET `/stats/analytics`
Get analytics data for charts and graphs (admin only).

#### GET `/stats/health`
Statistics service health check (requires authentication).

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "errors": [ ... ] // For validation errors
}
```

## Common Error Codes

- `MISSING_TOKEN`: Authentication token not provided
- `INVALID_TOKEN`: Invalid or expired token
- `USER_NOT_FOUND`: User account not found
- `ACCOUNT_INACTIVE`: User account is deactivated
- `EMAIL_NOT_VERIFIED`: Email verification required
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `VALIDATION_ERROR`: Request validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `DUPLICATE_ENTRY`: Resource already exists
- `INTERNAL_SERVER_ERROR`: Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 20 requests per 15 minutes
- General endpoints: 200 requests per 5 minutes
- Upload endpoints: 10 requests per 5 minutes
- Admin endpoints: 100 requests per 15 minutes

## File Uploads

File uploads are supported for:
- Profile images (max 5MB, JPEG/PNG/WebP)
- Gallery images (max 10MB, JPEG/PNG/WebP)

Files are served from `/uploads/` directory.

## Pagination

List endpoints support pagination with query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default varies by endpoint)

Response includes pagination metadata:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- File upload restrictions
- Role-based access control

## Development Notes

- All timestamps are in ISO 8601 format
- Database uses PostgreSQL with Sequelize ORM
- Email notifications are sent for key events
- File uploads create thumbnails automatically
- Soft deletes are used where appropriate
- Comprehensive logging for debugging
- Environment-specific configurations