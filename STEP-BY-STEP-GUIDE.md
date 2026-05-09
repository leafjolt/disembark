# STEP-BY-STEP GUIDE

This document is a living setup guide for the Disembark project. It is written during Weeks 13–15 and reflects the actual backend, frontend, and deployment setup for this repository.

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

---

## Week 14: Front-end Setup

### Install frontend dependencies from the repo root
1. From the repository root, install all dependencies for both frontend and backend once:
   ```bash
   npm install:all
   ```
2. Confirm the frontend environment files exist at `disembark-frontend/.env.development` and `disembark-frontend/.env.production`. If they do not, create them.

### Configure `VITE_API_URL`
1. Open `disembark-frontend/.env.development` for local development.
2. Set the local API URL:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
3. For production, update `disembark-frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-app-render.onrender.com/api
   ```
4. Vite automatically loads the appropriate `.env` file based on the command:
   - `npm run dev` loads `.env.development`
   - `npm run build` loads `.env.production`
5. The frontend stores in `disembark-frontend/src/stores/auth.js` and `disembark-frontend/src/stores/trips.js` then use the correct API URL.

### Run the app from the repository root
1. Start both backend and frontend together from the repo root:
   ```bash
   npm run dev
   ```
2. Open the local URL printed by Vite, usually:
   ```bash
   http://localhost:5173
   ```
3. If you only want to start the backend or frontend individually, use these root commands:
   - Backend only:
     ```bash
     npm run dev:backend
     ```
   - Frontend only:
     ```bash
     npm run dev:frontend
     ```

### Verify the front-end connects to the backend
1. Register a new user in the frontend app.
2. Log in and create a trip.
3. Confirm trips and events load successfully.
4. Open browser dev tools and verify network requests go to:
   - `http://localhost:3000/api/auth/login`
   - `http://localhost:3000/api/trips`

### Frontend project structure
- `disembark-frontend/src/main.js` — Vue app entrypoint
- `disembark-frontend/src/router/index.js` — Vue Router routes and guards
- `disembark-frontend/src/stores/auth.js` — authentication state and API calls
- `disembark-frontend/src/stores/trips.js` — trips and event state management
- `disembark-frontend/src/views/` — app pages for signup, login, trips, itinerary, and event editing

### AI tooling / Claude Code
- This repository does not include a `CLAUDE.md` configuration file.
- If you use Claude Code or similar AI tooling, add any project-specific instructions in a root config file so your AI assistant knows the repo structure.

---

## Week 15: Deployment

### Deploy the backend to Render
1. Create a new [Render](https://render.com) web service and connect it to this repository.
2. Set the build root directory to `backend/`.
3. In Render, set the environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string.
   - `JWT_SECRET` — secret used to sign JWT tokens.
4. Set the deploy start command to:
   ```bash
   npm run start
   ```
5. Deploy the backend and verify the Render backend URL (seen in the dashboard) returns:
   ```json
   { "message": "Disembark server is running" }
   ```

### Deploy the frontend to GitHub Pages
1. From the repository root, build the frontend:
   ```bash
   npm run build
   ```
2. Run this command to deploy to GitHub:
   ```bash
   npm run deploy
   ```
3. Confirm the site is available at:
   ```text
   https://your-username.github.io/disembark/
   ```

### Link the deployed front-end to the Render backend
1. Copy your Render backend URL, for example:
   ```text
   https://your-backend.onrender.com
   ```
2. In `disembark-frontend/.env.production`, set:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
3. Rebuild the frontend from the repo root:
   ```bash
   npm run build
   ```
4. Deploy to GitHub Pages once again:
   ```bash
   npm run deploy
   ```
5. The frontend will then send API requests to the Render backend.

### CORS configuration
- The backend currently enables CORS for all origins using `cors()` in `backend/server.js`.
- This allows your deployed frontend on GitHub Pages to call the Render backend.
- If you later restrict CORS, add your deployed frontend origin to the allowed origins.

---