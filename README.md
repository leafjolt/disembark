# Disembark
Disembark is a web app for managing travel itineraries, putting all your flight/hotel/activity events in chronological order in one place.

## Live URLs
Frontend: <https://leafjolt.github.io/disembark>

Backend: <https://disembark.onrender.com>

## Local Setup Instructions
To run on your device, follow these instructions:
1. Set environment variables in both the frontend and backend folders. 
    - For frontend, you must make an `.env.development` or `env.production` (depending on if hosting locally or trying to deploy in production) file and set the `VITE_API_URL` to localhost (by default `http://localhost:3000`) or your publicly hosted backend. 
    - For backend, you must make a `.env` file and set `MONGODB_URI` to your hosted MongoDB Atlas instance and `JWT_SECRET` to a generated JWT secret.
2. Run `npm run dev` from the root directory. This will start both the frontend and backend.
3. Go to <http://localhost:5173> in your browser and you will see the frontend running.