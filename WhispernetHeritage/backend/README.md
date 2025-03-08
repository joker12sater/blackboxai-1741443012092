# WhispernetHeritage Backend

Backend server for the WhispernetHeritage application, providing API endpoints and real-time chat functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Stories
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create new story
- `GET /api/stories/:id` - Get story by ID
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story
- `POST /api/stories/:id/like` - Like story
- `POST /api/stories/:id/comments` - Add comment to story

### Businesses
- `GET /api/businesses` - Get all businesses
- `POST /api/businesses` - Register new business
- `GET /api/businesses/:id` - Get business by ID
- `PUT /api/businesses/:id` - Update business
- `POST /api/businesses/:id/subscribe` - Subscribe to premium
- `POST /api/businesses/:id/reviews` - Add review

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration
- `GET /api/events/:id/attendees` - Get event attendees

## WebSocket Events

### Chat
- `connection` - Client connects to server
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send message to room
- `new_message` - Receive new message
- `typing_status` - User typing status
- `user_joined` - User joined room notification
- `user_left` - User left room notification

## Features

- JWT Authentication
- Real-time chat with Socket.IO
- Input validation
- Error handling
- Rate limiting
- CORS support
- File upload support
- Pagination
- Request logging

## Project Structure

```
backend/
├── config/
│   └── config.js         # Configuration settings
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── error.js          # Error handling middleware
│   └── validation.js     # Input validation middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── stories.js        # Stories routes
│   ├── business.js       # Business routes
│   └── events.js         # Events routes
├── socket/
│   └── chatHandler.js    # WebSocket chat handler
├── utils/
│   └── helpers.js        # Utility functions
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Project dependencies
├── README.md           # Project documentation
└── server.js           # Main application file
```

## Error Handling

The API uses the following error status codes:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Rate Limiting

API requests are limited to:
- 100 requests per 15 minutes per IP address

## Pagination

All list endpoints support pagination with the following query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 50)

## Development

1. Install development dependencies:
```bash
npm install --save-dev nodemon
```

2. Run in development mode:
```bash
npm run dev
```

## Production

1. Set environment variables:
```env
NODE_ENV=production
```

2. Start the server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
