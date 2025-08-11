# DecorVista Database Design

## Database Schema (MySQL 8.0+)

### 1. Users Table
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'designer', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP NULL
);
```

### 2. User Details Table
```sql
CREATE TABLE user_details (
    userdetails_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    contact_number VARCHAR(20),
    address TEXT,
    profile_image VARCHAR(255),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 3. Interior Designers Table
```sql
CREATE TABLE interior_designers (
    designer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    years_of_experience INT DEFAULT 0,
    specialization VARCHAR(100),
    bio TEXT,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    portfolio_images JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    license_number VARCHAR(50),
    education TEXT,
    certifications TEXT,
    languages_spoken JSON,
    service_areas JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 4. Categories Table
```sql
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT NULL,
    category_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);
```

### 5. Products Table
```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(200) NOT NULL,
    category_id INT NOT NULL,
    brand VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    images JSON,
    dimensions VARCHAR(100),
    materials VARCHAR(200),
    color VARCHAR(50),
    style VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    weight DECIMAL(8,2),
    purchase_url VARCHAR(500),
    retailer_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);
```

### 6. Consultations Table
```sql
CREATE TABLE consultations (
    consultation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    designer_id INT NOT NULL,
    scheduled_datetime DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled') DEFAULT 'pending',
    consultation_type ENUM('virtual', 'in_person') DEFAULT 'virtual',
    notes TEXT,
    project_brief TEXT,
    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    meeting_link VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (designer_id) REFERENCES interior_designers(designer_id) ON DELETE CASCADE
);
```

### 7. Designer Availability Table
```sql
CREATE TABLE designer_availability (
    availability_id INT PRIMARY KEY AUTO_INCREMENT,
    designer_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (designer_id) REFERENCES interior_designers(designer_id) ON DELETE CASCADE
);
```

### 8. Reviews Table
```sql
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NULL,
    designer_id INT NULL,
    consultation_id INT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (designer_id) REFERENCES interior_designers(designer_id) ON DELETE CASCADE,
    FOREIGN KEY (consultation_id) REFERENCES consultations(consultation_id) ON DELETE CASCADE
);
```

### 9. Saved Designs Table
```sql
CREATE TABLE saved_designs (
    saved_design_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    design_name VARCHAR(200) NOT NULL,
    design_data JSON,
    inspiration_images JSON,
    room_type VARCHAR(50),
    style_preference VARCHAR(50),
    color_scheme VARCHAR(100),
    budget_range VARCHAR(50),
    notes TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 10. Cart Items Table
```sql
CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);
```

### 11. Inspiration Gallery Table
```sql
CREATE TABLE inspiration_gallery (
    gallery_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    room_type VARCHAR(50),
    style VARCHAR(50),
    color_scheme VARCHAR(100),
    tags JSON,
    uploaded_by INT,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL
);
```

### 12. User Saved Inspirations Table
```sql
CREATE TABLE user_saved_inspirations (
    saved_inspiration_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    gallery_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (gallery_id) REFERENCES inspiration_gallery(gallery_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_gallery (user_id, gallery_id)
);
```

### 13. Blog Posts Table
```sql
CREATE TABLE blog_posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    author_id INT NOT NULL,
    category VARCHAR(50),
    tags JSON,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 14. Notifications Table
```sql
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 15. System Settings Table
```sql
CREATE TABLE system_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Database Indexes for Performance

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Products table indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_available ON products(is_available);
CREATE FULLTEXT INDEX idx_products_search ON products(product_name, description);

-- Consultations table indexes
CREATE INDEX idx_consultations_user ON consultations(user_id);
CREATE INDEX idx_consultations_designer ON consultations(designer_id);
CREATE INDEX idx_consultations_datetime ON consultations(scheduled_datetime);
CREATE INDEX idx_consultations_status ON consultations(status);

-- Reviews table indexes
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_designer ON reviews(designer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created ON reviews(created_at);

-- Gallery table indexes
CREATE INDEX idx_gallery_room_type ON inspiration_gallery(room_type);
CREATE INDEX idx_gallery_style ON inspiration_gallery(style);
CREATE INDEX idx_gallery_featured ON inspiration_gallery(is_featured);
CREATE FULLTEXT INDEX idx_gallery_search ON inspiration_gallery(title, description);
```

## Sample Data Insertion

```sql
-- Insert sample categories
INSERT INTO categories (category_name, description) VALUES
('Furniture', 'All types of furniture items'),
('Lighting', 'Lighting fixtures and accessories'),
('Decor', 'Decorative items and accessories'),
('Rugs and Carpets', 'Floor coverings and rugs'),
('Wall Art', 'Paintings, prints, and wall decorations'),
('Curtains and Blinds', 'Window treatments');

-- Insert subcategories
INSERT INTO categories (category_name, description, parent_category_id) VALUES
('Sofas', 'Living room sofas and couches', 1),
('Dining Tables', 'Dining room tables', 1),
('Bed Frames', 'Bedroom furniture', 1),
('Chandeliers', 'Ceiling lighting fixtures', 2),
('Table Lamps', 'Desk and side table lamps', 2),
('Vases', 'Decorative vases and containers', 3);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'DecorVista', 'Website name'),
('site_description', 'Your premier destination for home interior design', 'Website description'),
('max_file_size', '5242880', 'Maximum file upload size in bytes (5MB)'),
('allowed_image_types', 'jpg,jpeg,png,gif,webp', 'Allowed image file extensions'),
('consultation_duration_options', '30,60,90,120', 'Available consultation durations in minutes');
```

## Database Relationships Summary

### One-to-Many Relationships
- `users` → `user_details` (1:1)
- `users` → `interior_designers` (1:1)
- `users` → `consultations` (1:N)
- `users` → `reviews` (1:N)
- `users` → `saved_designs` (1:N)
- `users` → `cart_items` (1:N)
- `categories` → `products` (1:N)
- `categories` → `categories` (parent-child)
- `products` → `reviews` (1:N)
- `interior_designers` → `consultations` (1:N)
- `interior_designers` → `reviews` (1:N)

### Many-to-Many Relationships
- `users` ↔ `inspiration_gallery` (through `user_saved_inspirations`)

### Key Constraints
- All foreign keys have appropriate CASCADE or RESTRICT actions
- Unique constraints on email, username, and SKU
- Check constraints on rating values (1-5)
- Enum constraints for status fields and categorical data

This database design supports all the functional requirements specified in the SRS document while maintaining data integrity, performance, and scalability.