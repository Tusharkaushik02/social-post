# Social Post Backend API

Production-ready backend API for the Social Post application built with Express.js and MongoDB.

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB
- ImageKit account (for image uploads)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

### 3. Run the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controller/       # Request handlers
│   ├── db/              # Database connection
│   ├── middleware/      # Custom middleware
│   ├── model/           # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── app.js           # Express app setup
├── server.js            # Server entry point
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── README.md            # This file
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Check server status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts/create` - Create new post (requires image)
- `DELETE /api/posts/:id` - Delete post

## 🔧 Configuration

### Environment Variables

- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `IMAGEKIT_*` - ImageKit credentials for image uploads
- `CORS_ORIGIN` - Frontend origin for CORS
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **jsonwebtoken** - JWT authentication
- **multer** - File upload handling
- **@imagekit/nodejs** - Image upload service
- **cors** - CORS middleware

## 🔒 Security Best Practices

- ✅ Environment variables for sensitive data
- ✅ CORS configuration for frontend origin
- ✅ JWT authentication for protected routes
- ✅ Error handling middleware
- ✅ Input validation
- ✅ Secure file uploads with multer

## 📝 Development Notes

- Use `npm run dev` during development for automatic server restart
- Check logs for debugging information
- Ensure MongoDB is running before starting the server
- ImageKit credentials must be configured for image upload features

## 🚢 Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2 for production: `pm2 start server.js --name "social-post-api"`
3. Set up MongoDB in production (Atlas or self-hosted)
4. Configure all environment variables for production
5. Use a reverse proxy like Nginx for SSL/TLS

## 📄 License

ISC

## 👨‍💻 Support

For issues and questions, please check the main project repository.
