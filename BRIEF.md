# Brief - Project Proposal
**1. Project name**: Disembark

**2. The problem it solves — one or two sentences. Who uses this, and what does it let them do?**:
It is difficult to arrange complex trips and handle flights/transport, hotels, restaurants, activies, etc on your own; they end up scattered across emails and notes. This app would be used by travelers to plan out trips and have everything in one place, letting them easily create an itinerary even for complex, long trips.


**3. Your chosen idea — feature list — bullet points, 3–5 core features only**
- Create an account that acts as a dashboard for any planned trips
- Create trips with specified destinations and dates
- Update created trips with transport, hotels, and activities
- View a trip in an easy chronological itinerary UI


**4. Data model — list the MongoDB collections you expect to need and the key fields in each**
- users
    - id
    - email
    - passwordHash
    - firstName
    - lastName
    - createdAt
    - updatedAt
- trips
    - id
    - userId
    - title
    - startDate
    - endDate
    - createdAt
    - updatedAt
    - events (array of objects)
        - type (transport, accommodation, or activity)
        - title, date, time, notes - shared base fields
        - Fields based on type of event: airline, flightNumber, from, to, confirmationCode, checkIn, checkOut, address, cost, currency

**5. API endpoint table — list every route you plan to build (method, path, what it does)**

Auth
- `POST /api/auth/register` — Create a new user account
- `POST /api/auth/login` — Log in, return a JWT

Trips
- `GET /api/trips` — Get all trips for the logged-in user
- `POST /api/trips` — Create a new trip
- `GET /api/trips/:id` — Get a single trip object with all its events
- `PUT /api/trips/:id` — Update trip metadata (title, dates, etc.)
- `DELETE /api/trips/:id` — Delete a trip and all its events

Events
- `POST /api/trips/:id/events` — Add an event to a trip
- `PUT /api/trips/:id/events/:eid` — Update a specific event
- `DELETE /api/trips/:id/events/:eid` — Remove a specific event from a trip

**6. Does your app need authentication? Yes or no, with one sentence of justification**
Yes, the app will need authentication to support the feature of users having accounts to view all their trips in one place. This also makes sure only the user who owns the trip can make changes and view it.