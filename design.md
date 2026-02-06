# Locana Mobile App - Design Document

## System Architecture

### 1. High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (Supabase)    │
│   - React       │    │   - REST APIs   │    │   - PostgreSQL  │
│   - TypeScript  │    │   - WebSockets  │    │   - Real-time   │
│   - Tailwind    │    │   - Auth        │    │   - Storage     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   Services      │    │   Monitoring    │
│   - Maps API    │    │   - OpenAI      │    │   - Analytics   │
│   - Payment     │    │   - Whisper     │    │   - Logging     │
│   - SMS/Email   │    │   - TTS         │    │   - Metrics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase Edge Functions
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth with JWT tokens
- **Deployment**: Vercel with edge functions
- **Storage**: Supabase Storage for images and files
- **AI Services**: OpenAI GPT-4, Whisper, TTS

## Database Design

### 1. Core Tables Schema

#### Users Table
```sql
users (
  id: uuid PRIMARY KEY,
  email: varchar UNIQUE,
  phone: varchar UNIQUE,
  full_name: varchar,
  role: enum('customer', 'owner'),
  created_at: timestamp,
  updated_at: timestamp
)
```

#### Shops Table
```sql
shops (
  id: uuid PRIMARY KEY,
  owner_id: uuid REFERENCES users(id),
  name: varchar NOT NULL,
  description: text,
  address: text,
  latitude: decimal,
  longitude: decimal,
  category: varchar,
  phone: varchar,
  email: varchar,
  is_verified: boolean DEFAULT false,
  created_at: timestamp,
  updated_at: timestamp
)
```

#### Products Table
```sql
products (
  id: uuid PRIMARY KEY,
  shop_id: uuid REFERENCES shops(id),
  name: varchar NOT NULL,
  description: text,
  price: decimal,
  category: varchar,
  image_url: varchar,
  stock_quantity: integer DEFAULT 0,
  is_available: boolean DEFAULT true,
  created_at: timestamp,
  updated_at: timestamp
)
```

#### Reservations Table
```sql
reservations (
  id: uuid PRIMARY KEY,
  customer_id: uuid REFERENCES users(id),
  product_id: uuid REFERENCES products(id),
  quantity: integer,
  status: enum('pending', 'confirmed', 'completed', 'cancelled'),
  reserved_until: timestamp,
  created_at: timestamp,
  updated_at: timestamp
)
```

### 2. Relationships & Indexes
- **Foreign Keys**: Proper referential integrity
- **Indexes**: Location-based queries, search optimization
- **Real-time**: Supabase subscriptions for live updates

## API Design

### 1. Authentication Endpoints
```typescript
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
PUT  /api/auth/profile
```

### 2. Shop Management Endpoints
```typescript
GET    /api/shops              // List shops with filters
POST   /api/shops              // Create shop (owner only)
GET    /api/shops/:id          // Get shop details
PUT    /api/shops/:id          // Update shop (owner only)
DELETE /api/shops/:id          // Delete shop (owner only)
GET    /api/shops/nearby       // Location-based shop search
```

### 3. Product Management Endpoints
```typescript
GET    /api/products           // List products with filters
POST   /api/products           // Create product (owner only)
GET    /api/products/:id       // Get product details
PUT    /api/products/:id       // Update product (owner only)
DELETE /api/products/:id       // Delete product (owner only)
POST   /api/products/search    // Advanced product search
```

### 4. Stock Management Endpoints
```typescript
PUT  /api/stock/update         // Manual stock update
POST /api/stock/voice-update   // Voice-based stock update
POST /api/stock/image-update   // Image-based stock update
GET  /api/stock/history        // Stock change history
```

### 5. Reservation Endpoints
```typescript
POST   /api/reservations       // Create reservation
GET    /api/reservations       // List user reservations
PUT    /api/reservations/:id   // Update reservation status
DELETE /api/reservations/:id   // Cancel reservation
```

## UI/UX Design

### 1. Design System
- **Color Palette**: 
  - Primary: #E23744 (Locana Red)
  - Secondary: #F8F8F8 (Light Gray)
  - Background: #FFFFFF (White)
  - Text: #1C1C1C (Dark Gray)
- **Typography**: Geist Sans for UI, Geist Mono for code
- **Spacing**: 8px base unit system
- **Border Radius**: 8px standard, 12px for cards

### 2. Component Library
- **Buttons**: Primary, secondary, ghost, destructive variants
- **Cards**: Product cards, shop cards, 3D animated cards
- **Forms**: Input fields, selects, checkboxes, radio buttons
- **Navigation**: Bottom nav, mobile header, breadcrumbs
- **Modals**: Dialog, drawer, alert dialog
- **Feedback**: Toast notifications, loading states, error states

### 3. Screen Layouts

#### Customer Flow
1. **Home Screen**: Featured shops, categories, search bar
2. **Shop Discovery**: Grid/list view, filters, map view
3. **Shop Detail**: Products, info, reviews, directions
4. **Product Search**: Real-time search, filters, results
5. **Cart**: Multi-shop cart, checkout, payment
6. **Profile**: Orders, reservations, settings

#### Owner Flow
1. **Dashboard**: Analytics, quick actions, notifications
2. **Inventory**: Product list, stock levels, bulk actions
3. **Add Product**: Form with image upload, categories
4. **Stock Update**: Voice, image, manual update options
5. **Orders**: Reservation management, order fulfillment
6. **Analytics**: Sales reports, customer insights

### 4. Mobile-First Design
- **Responsive Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch Targets**: Minimum 44px for interactive elements
- **Gestures**: Swipe navigation, pull-to-refresh
- **Performance**: Lazy loading, image optimization

## Security Design

### 1. Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Customer vs owner permissions
- **Session Management**: Automatic token refresh
- **Password Security**: Bcrypt hashing, strength requirements

### 2. Data Protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection**: Parameterized queries, ORM usage
- **XSS Prevention**: Content sanitization, CSP headers
- **CSRF Protection**: Token-based CSRF protection

### 3. API Security
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **CORS Configuration**: Proper cross-origin policies
- **HTTPS Only**: SSL/TLS encryption for all communications
- **API Keys**: Secure external service integration

## Performance Optimization

### 1. Frontend Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Next.js Image component, WebP format
- **Caching**: Browser caching, service worker caching
- **Bundle Size**: Tree shaking, dynamic imports

### 2. Backend Optimization
- **Database Indexing**: Optimized queries for location and search
- **Caching Strategy**: Redis for session and frequently accessed data
- **CDN**: Static asset delivery via Vercel Edge Network
- **API Response**: Pagination, field selection, compression

### 3. Real-time Performance
- **WebSocket Optimization**: Efficient real-time updates
- **Debouncing**: Search input and stock updates
- **Batch Operations**: Bulk database operations
- **Connection Pooling**: Efficient database connections

## Deployment Architecture

### 1. Environment Setup
- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Vercel deployment with edge functions

### 2. CI/CD Pipeline
- **Version Control**: Git with feature branch workflow
- **Automated Testing**: Unit tests, integration tests
- **Build Process**: Next.js build optimization
- **Deployment**: Automatic deployment on merge to main

### 3. Monitoring & Analytics
- **Error Tracking**: Sentry for error monitoring
- **Performance Monitoring**: Vercel Analytics
- **User Analytics**: Custom analytics dashboard
- **Logging**: Structured logging for debugging

## Scalability Considerations

### 1. Horizontal Scaling
- **Stateless Design**: No server-side session storage
- **Database Scaling**: Read replicas, connection pooling
- **CDN Usage**: Global content distribution
- **Microservices**: Modular service architecture

### 2. Caching Strategy
- **Browser Caching**: Static assets and API responses
- **Server Caching**: Database query results
- **Edge Caching**: Vercel Edge Network
- **Application Caching**: In-memory caching for hot data

### 3. Future Enhancements
- **Mobile Apps**: React Native implementation
- **Advanced AI**: ML-based recommendations
- **IoT Integration**: Smart inventory sensors
- **Multi-tenant**: Support for franchise operations