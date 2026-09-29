# FAQ AI Assistant API

A Node.js + Express API for user authentication, FAQ management, and AI-powered answer generation using Google Gemini.

## Overview

This project provides a backend for an FAQ system with:

- User registration and login
- JWT-based authentication
- FAQ endpoints
- AI answer generation via Gemini
- MongoDB persistence

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Google Gemini API
- dotenv for environment configuration

## Project Structure

```bash
FAQ/
├── app.js
├── server.js
├── .env
├── package.json
├── config/
│   └── db.js
├── controllers/
│   ├── aiController.js
│   ├── authController.js
│   ├── faqController.js
│   └── faqControllers.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── models/
│   ├── FAQ.js
│   └── User.js
├── routes/
│   ├── aiRoutes.js
│   ├── authRoutes.js
│   ├── faqRoutes.js
│   └── faqRouter.js
├── utils/
│   └── helpers.js
└── README.MD
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a valid MongoDB connection string
- A Google Gemini API key

## Installation

1. Clone the repository and navigate to the project folder.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root using the variables below.

## Environment Variables

Create a `.env` file with the following values:

```env
PORT=2000
MONGODB_URI=mongodb://localhost:27017/FAQ
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

## Running the Server

Start the server in development mode:

```bash
npm run dev
```

Or run it normally:

```bash
npm start
```

The server will start on:

```bash
http://localhost:2000
```

## API Endpoints

### Authentication

#### Register a user

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes a JWT token that should be sent in the Authorization header for protected routes.

### FAQ Routes

```http
GET /api/faqs
GET /api/faqs/:id
GET /api/faqs/search?q=configure
POST /api/faqs
DELETE /api/faqs/:id
```

FAQ creation and deletion require a Bearer token. FAQ search is public:

```http
Authorization: Bearer <token>
```

#### Create an FAQ

After registering and logging in, copy the `token` from the login response. In Postman or Thunder Client, send:

```http
POST http://localhost:2000/api/faqs
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "question": "How do I configure custom category tags?",
  "answer": "Navigate to the settings panel, append keyword tags, and save the schema.",
  "category": "Configuration",
  "tags": ["settings", "configuration", "tags"]
}
```

Expect HTTP `201`; the FAQ is stored in MongoDB and associated with the logged-in user.

#### Search FAQs

Send `GET http://localhost:2000/api/faqs/search?q=configure` without an Authorization header. Expect HTTP `200` with `success`, `count`, and `data`; matching is case-insensitive across questions, answers, categories, and tags, with at most 20 newest records.

#### API test sequence

1. Register with `POST /api/auth/register` and `{ "name": "Test User", "email": "test@example.com", "password": "password123" }`.
2. Log in with `POST /api/auth/login` and `{ "email": "test@example.com", "password": "password123" }`; copy the returned token.
3. Create an FAQ with the request above and the Bearer token.
4. Search with `GET /api/faqs/search?q=configure` and no token.
5. Repeat FAQ creation with a missing `category`; expect HTTP `400`. Repeat with `Authorization: Bearer invalid`; expect HTTP `401`.

### AI Answer Generation

```http
POST /api/ai/generate
```

Request body:

```json
{
  "prompt": "How do I reset my password?"
}
```

Response:

```json
{
  "success": true,
  "answer": "...generated answer..."
}
```

## Authentication Example

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Notes

- FAQ records, including their tags and creator, are stored in MongoDB; keyword search reads those stored records.
- The AI generation endpoint uses the Google Gemini API through the `@google/genai` SDK.
- MongoDB must be running before starting the server.

## License

This project is for educational and development use unless otherwise specified.
