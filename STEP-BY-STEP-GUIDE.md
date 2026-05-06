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

### Clone or open the frontend project
1. From the repo root, change into the frontend folder:
   ```bash
   cd disembark-frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Confirm the frontend environment file exists at `disembark-frontend/.env`.

### Configure `VITE_API_URL`
1. Open `disembark-frontend/.env.development` (for local development).
2. Set the API URL used by the frontend stores:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
3. For production, update `disembark-frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-deployed-backend-url.com/api
   ```
4. Vite automatically loads the appropriate `.env` file based on the build command:
   - `npm run dev` loads `.env.development`
   - `npm run build` loads `.env.production`
5. The stores in `disembark-frontend/src/stores/auth.js` and `disembark-frontend/src/stores/trips.js` will automatically use the correct API URL.

### Run the frontend dev server
1. Start the backend first in a separate terminal:
   ```bash
   cd backend
   npm run dev
   ```
2. In another terminal, start the frontend:
   ```bash
   cd disembark-frontend
   npm run dev
   ```
3. Open the local URL printed by Vite, usually:
   ```
   http://localhost:5173
   ```

**Alternative: Run both servers with one command**
From the repository root, you can run both frontend and backend simultaneously:
```bash
npm run dev
```
This requires installing dependencies in the root first:
```bash
npm install
```

### Verify the frontend connects to the backend
1. Register a new user in the frontend app.
2. Log in and create a trip.
3. If you can successfully load trips and add events, the frontend is connecting to the backend.
4. You can also open browser developer tools and confirm network requests are sent to:
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

### Deploy the backend to Railway
1. Create a new Railway project and connect it to this repository, or deploy from the `backend/` folder.
2. Because this repo contains both frontend and backend, make sure Railway is configured to use the backend root directory.
   - In the Railway dashboard, set the project root / working directory to `backend/`.
   - If using GitHub deploy, select the repo and then choose `backend/` as the root directory.
3. In Railway, set environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string.
   - `JWT_SECRET` — secret used to sign JWT tokens.
   - `NODE_ENV` — set to `production`.
   - `PORT` — optional. Railway usually provides a port automatically.
4. Set the start command to:
   ```bash
   npm start
   ```
5. Deploy and verify the backend URL returns the health endpoint successfully.

### Deploy the frontend to GitHub Pages
1. Build the frontend static site from `disembark-frontend/`:
   ```bash
   cd disembark-frontend
   npm install
   npm run build
   ```
2. If you are using GitHub Pages, deploy the contents of `disembark-frontend/dist/`.
3. Configure GitHub Pages to serve from the deployed `gh-pages` branch or from the repository's Pages settings.
4. Alternatively, use a GitHub Actions workflow to automatically build and publish `disembark-frontend/dist/` on push.

### Set environment variables in the Railway dashboard
1. Open your Railway project and go to **Settings** or **Variables**.
2. Add these variables for the backend service:
   - `MONGODB_URI` — your MongoDB Atlas connection string.
   - `JWT_SECRET` — a random secret string for JWT signing.
   - `NODE_ENV` — `production`.
3. Leave Railway's assigned `PORT` unchanged.
4. If your backend needs any additional environment-specific config, add it here.

### Link the deployed front-end to the deployed back-end
1. Get the Railway backend base URL, for example:
   ```
   https://your-app-railway.up.railway.app
   ```
2. In `disembark-frontend/.env.production`, set:
   ```env
   VITE_API_URL=https://your-app-railway.up.railway.app/api
   ```
3. Rebuild the frontend after updating the production environment:
   ```bash
   cd disembark-frontend
   npm run build
   ```
4. Deploy the rebuilt `dist/` folder to GitHub Pages.
5. The frontend will then send API requests to your Railway backend URL.

### CORS configuration
- The backend currently enables CORS for all origins using `cors()` in `backend/server.js`.
- This means your deployed frontend on GitHub Pages can call the Railway backend without extra CORS setup.
- If you later restrict CORS, add your GitHub Pages domain to the allowed origins.


### Deploy the frontend to GitHub Pages
1. Build the frontend static site from `disembark-frontend/`:
   ```bash
   npm run build
   ```
2. Deploy the generated `dist/` folder to GitHub Pages, Netlify, or another static host.
3. In GitHub Pages or your chosen host, point the site to the `dist/` output.

### Link frontend to backend in production
1. Update the frontend environment for production to use the deployed backend URL.
2. Edit `disembark-frontend/.env.production` and replace the placeholder:
   ```env
   VITE_API_URL=https://your-deployed-backend-url.com/api
   ```
3. Build the frontend with the production environment:
   ```bash
   cd disembark-frontend
   npm run build
   ```
4. Deploy the generated `dist/` folder to GitHub Pages, Netlify, or another static host.

### CORS configuration
- The backend already enables CORS for all origins using `cors()` in `backend/server.js`.
- This means the deployed frontend should be allowed to call the deployed backend without additional CORS changes.
- If you lock CORS to specific origins later, add the frontend deployment origin to the allowed list.

---