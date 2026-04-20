# STEP-BY-STEP GUIDE

This document is a living setup guide for the Disembark project. It is written during Weeks 13–15 and reflects the actual backend setup that has been completed so far. Frontend and deployment will be added in the future.

---

## Week 13: Back-end Setup

### Prerequisites
- Node.js 18+ installed.
- npm available in your terminal.
- MongoDB access via Atlas or a local MongoDB instance.
- A code editor such as VS Code.
- Thunder Client, Postman, or a similar API testing extension.

### Clone the repository and install dependencies
1. Open a terminal.
2. Clone this repository:
   ```bash
   git clone https://github.com/leafjolt/disembark.git
   cd disembark/backend
   ```
3. Install backend dependencies:
   ```bash
   npm install
   ```

### Configure the `.env` file
1. In `backend/`, create or update `.env`.
2. Use `.env.example` as a template.
3. Add these variables:
   - `MONGODB_URI` — your MongoDB connection string.
     - For local development: `mongodb://localhost:27017/disembark`
     - For Atlas: use the connection string from your Atlas cluster.
   - `JWT_SECRET` — a secret string used to sign JWT tokens.
     - Example placeholder: `your_jwt_secret_here`
   - `PORT` — optional port number for the backend server.
     - If omitted, the app defaults to `3000`.

Do not commit `.env` to GitHub. The repository already has a `.gitignore` rule to exclude `.env` files.

### How the backend is structured
- `backend/server.js` — main Express server.
- `backend/models/User.js` — Mongoose model for users.
- `backend/models/Trip.js` — Mongoose model for trips and embedded events.
- `backend/routes/auth.js` — authentication routes (`/api/auth/register`, `/api/auth/login`).
- `backend/routes/trips.js` — trip and event routes under `/api/trips`.
- `backend/middleware/auth.js` — JWT auth middleware.

### Connect to MongoDB Atlas
1. Create a MongoDB Atlas account and a cluster.
2. Create a database user with a password.
3. In Atlas, open the cluster connection details and copy the connection string.
4. Replace the `<password>` placeholder and database name in the string.
5. Paste the final URI into `backend/.env` as `MONGODB_URI`.

Example Atlas-style URI:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/disembark?retryWrites=true&w=majority
```

### Start the server and verify it is running
1. From `backend/`, start the server in development mode:
   ```bash
   npm run dev
   ```
2. Verify the server is running by visiting:
   ```
   http://localhost:3000/
   ```
3. You should see a JSON response:
   ```json
   { "message": "Disembark server is running" }
   ```

### Test routes in Thunder Client
Use the following endpoints with JSON bodies.

#### Register a new user
- URL: `POST http://localhost:3000/api/auth/register`
- Body:
  ```json
  {
    "email": "tester@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }
  ```

#### Login and get a JWT
- URL: `POST http://localhost:3000/api/auth/login`
- Body:
  ```json
  {
    "email": "tester@example.com",
    "password": "Password123!"
  }
  ```
- Response includes a token:
  ```json
  { "token": "<jwt>" }
  ```

#### Create a trip
- URL: `POST http://localhost:3000/api/trips`
- Header: `Authorization: Bearer <jwt>`
- Body:
  ```json
  {
    "title": "Paris Vacation",
    "startDate": "2026-05-01",
    "endDate": "2026-05-08"
  }
  ```

#### Add an event to a trip
- URL: `POST http://localhost:3000/api/trips/:id/events`
- Header: `Authorization: Bearer <jwt>`
- Body example:
  ```json
  {
    "type": "transport",
    "title": "Flight to Paris",
    "date": "2026-05-01T14:30:00.000Z",
    "time": "14:30",
    "airline": "Air France",
    "flightNumber": "AF123",
    "from": "JFK",
    "to": "CDG",
    "confirmationCode": "ABC123",
    "notes": "Check in 2 hours before departure"
  }
  ```

#### Update an event
- URL: `PUT http://localhost:3000/api/trips/:id/events/:eid`
- Header: `Authorization: Bearer <jwt>`
- Body example:
  ```json
  {
    "title": "Flight to Paris - Updated",
    "notes": "Gate changed to A12"
  }
  ```

#### Delete an event
- URL: `DELETE http://localhost:3000/api/trips/:id/events/:eid`
- Header: `Authorization: Bearer <jwt>`

#### Update a trip
- URL: `PUT http://localhost:3000/api/trips/:id`
- Header: `Authorization: Bearer <jwt>`
- Body:
  ```json
  {
    "title": "Paris Vacation - Updated",
    "startDate": "2026-05-02",
    "endDate": "2026-05-09"
  }
  ```

#### Delete a trip
- URL: `DELETE http://localhost:3000/api/trips/:id`
- Header: `Authorization: Bearer <jwt>`

#### Verify trips retrieval
- URL: `GET http://localhost:3000/api/trips`
- Header: `Authorization: Bearer <jwt>`
