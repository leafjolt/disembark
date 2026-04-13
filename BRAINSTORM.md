# Brainstorm
## AI Prompts
**Me:** I have a project for my web app development class where we're supposed to come up with a full stack application using Vue.js, Express, MongoDB, authentication, and deployment. I want to do something that would help people with travel, like an itinerary planner or something like that, but simple enough to complete in the few weeks we have. Can you recommend some ideas?

**AI:** Here are some travel-focused ideas that fit your constraints well:

**1. Trip Packing List Generator** — Users create trips and get a smart suggested packing list they can customize and check off. Core features: trip CRUD, checklist with item states, preset templates (beach trip, business travel, hiking).

**2. Travel Budget Tracker** — Users plan a trip with a budget, then log expenses by category as they travel. Core features: trip creation, expense logging, a simple summary/breakdown view.

**3. Visited Countries / Places Map** — Users log countries or cities they've visited with a short note and rating. The app shows a visual map and stats summary. Core features: place log CRUD, map visualization, stats panel.

**4. Flight/Trip Wishlist** — Users save destinations they want to visit, tag them with timeframes or budgets, and write notes. Core features: wishlist CRUD, tagging/filtering, a priority ranking, shareable public link.

**5. Day-by-Day Itinerary Builder** — Users create a trip, then add activities to specific days with times, locations, and notes. Core features: trip + itinerary CRUD, drag-to-reorder, read-only share link.

Recommendation: go with **#2 (Budget Tracker)** or **#5 (Itinerary Builder)**. The budget tracker is the safest scope. The itinerary builder is slightly more ambitious but more impressive to demo. Avoid #4 unless you're comfortable with a fairly minimal UI — it risks feeling like a fancy to-do list.

---

**Me:** Let's say I do a sort of itinerary builder, where people can add flights/trains/buses, activities, hotel stays, etc. What would the MongoDB database look like for this?

**AI:** You'd have two main collections: `users` and `trips`.

`users` is simple — just authentication and profile basics:

```json
{
  "_id": "ObjectId",
  "email": "ana@example.com",
  "passwordHash": "...",
  "displayName": "Ana",
  "createdAt": "2026-04-01T10:00:00Z"
}
```

`trips` is where the interesting structure lives. Each trip belongs to a user and contains an embedded `events` array — flights, hotels, activities, and transport all live here, distinguished by a `type` field:

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "Japan Spring 2026",
  "destination": "Japan",
  "startDate": "2026-03-20",
  "endDate": "2026-04-02",
  "events": [
    {
      "_id": "ObjectId",
      "type": "flight",
      "date": "2026-03-20",
      "time": "08:30",
      "title": "Prague → Tokyo",
      "airline": "Japan Airlines",
      "flightNumber": "JL123",
      "from": "PRG",
      "to": "NRT",
      "confirmationCode": "XYZ123",
      "notes": "Window seat booked"
    },
    {
      "_id": "ObjectId",
      "type": "accommodation",
      "date": "2026-03-21",
      "title": "Shinjuku Granbell Hotel",
      "address": "2-14-5 Kabukicho, Shinjuku",
      "checkIn": "2026-03-21",
      "checkOut": "2026-03-25",
      "confirmationCode": "HT998"
    },
    {
      "_id": "ObjectId",
      "type": "activity",
      "date": "2026-03-22",
      "time": "10:00",
      "title": "teamLab Planets",
      "duration": 120,
      "cost": 3200,
      "currency": "JPY"
    },
    {
      "_id": "ObjectId",
      "type": "transport",
      "date": "2026-03-25",
      "time": "09:15",
      "title": "Shinkansen to Kyoto",
      "from": "Tokyo Station",
      "to": "Kyoto Station",
      "operator": "JR"
    }
  ]
}
```

Key design decisions: events are embedded inside trips because they have no meaning outside their trip and you'll always fetch them together. A shared `type` field lets the frontend render different forms per event type while the backend uses a single endpoint. To build the day-by-day view, you just sort the array by `date` + `time` — no separate "day" grouping needed.

---

**Me:** Can you suggest some names for this project?

**AI:** Here are some ideas across a few directions:

*Clean & descriptive:* Wayfarer, Itinerai, Journi, Tripcraft, Roamplan

*Travel-feeling / evocative:* Wanderlog *(already taken)*, Tramonto, Horizons, Departed, Bon Voyage

*Short & brandable:* Voya, Triply, Pacé, Ventur, Roamr

Favorites: **Wayfarer**, **Tripcraft**, or **Voya**. Tripcraft in particular implies the idea of building something, which fits the itinerary-builder concept nicely.

---

**Me:** Going back to my MongoDB question, can you give me an example of how that would all look in Mongoose?

**AI:** Sure! Here's the full model setup.

The User model handles authentication with a pre-save hook to hash passwords and a helper method for login comparison:

```javascript
// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:{ type: String, required: true },
  displayName: { type: String, required: true, trim: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = async function (plaintext) {
  return bcrypt.compare(plaintext, this.passwordHash);
};

export default mongoose.model('User', userSchema);
```

The Trip model uses a single flat event schema with a `type` field, rather than separate schemas per event type. All optional fields for each type sit alongside the shared base fields:

```javascript
// models/Trip.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema({
  type:             { type: String, required: true, enum: ['flight', 'transport', 'accommodation', 'activity'] },
  title:            { type: String, required: true },
  date:             { type: String, required: true },
  time:             String,
  notes:            { type: String, default: '' },
  // Flight / transport
  airline:          String,
  flightNumber:     String,
  operator:         String,
  from:             String,
  to:               String,
  confirmationCode: String,
  bookingRef:       String,
  // Accommodation
  address:          String,
  checkIn:          String,
  checkOut:         String,
  // Activity
  duration:         Number,
  cost:             Number,
  currency:         { type: String, default: 'USD' },
  bookingUrl:       String
}, { _id: true });

const tripSchema = new Schema({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, trim: true },
  destination: { type: String, trim: true },
  startDate:   String,
  endDate:     String,
  coverImage:  String,
  events:      [eventSchema]
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);
```

And the key route handlers:

```javascript
// GET all trips — exclude events for the dashboard list view
export const getTrips = async (req, res) => {
  const trips = await Trip.find({ userId: req.user.id }).select('-events');
  res.json(trips);
};

// GET single trip — sort events chronologically
export const getTrip = async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  trip.events.sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`));
  res.json(trip);
};

// POST add event
export const addEvent = async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  trip.events.push(req.body);
  await trip.save();
  res.status(201).json(trip);
};

// PUT update event
export const updateEvent = async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  const event = trip.events.id(req.params.eid);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  Object.assign(event, req.body);
  await trip.save();
  res.json(trip);
};

// DELETE remove event
export const deleteEvent = async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  trip.events.pull({ _id: req.params.eid });
  await trip.save();
  res.json({ message: 'Event removed' });
};
```

Notable details: `{ _id: true }` on the event schema enables `trip.events.id(eid)` lookups. `.select('-events')` keeps the dashboard endpoint lean. `Object.assign(event, req.body)` handles partial updates cleanly.

---

**Me:** Why is it better to have flights and all events under one thing rather than putting it into separate columns?

**AI:** It comes down to how MongoDB works versus a relational database like SQL.

In SQL you *would* use separate tables — `flights`, `accommodations`, `activities`, `transport` — each with a `trip_id` foreign key, joined together when needed. That's fine in SQL because it's designed for joins.

MongoDB doesn't have joins in the traditional sense. You can simulate them with `$lookup`, but it's clunky. The core philosophy is **store together what you read together** — if you always need events when you load a trip, they should live inside the trip document. Splitting them into separate collections would mean 4 separate queries every time you load an itinerary.

The other practical reasons for one `events` array: you always fetch events with their trip so there's no reason to separate them; adding a new event type (e.g. "restaurant") is just a new `type` value, not a new collection; and sorting everything chronologically is a single `.sort()` call instead of merging multiple arrays.

You *would* use separate collections if the array could grow to thousands of entries, if you needed to query events independently across trips, or if events were shared between multiple parents. None of those apply here.

Short version: in SQL, normalize by default. In MongoDB, embed by default, and only split when you have a specific reason to.

---

**Me:** Why is there not a separate flights attribute under the trip model; why do we put it all under events?

**AI:** You *could* give each type its own array on the trip:

```javascript
const tripSchema = new Schema({
  userId: ...,
  title: ...,
  flights:        [flightSchema],
  accommodations: [accommodationSchema],
  activities:     [activitySchema],
  transport:      [transportSchema]
});
```

But the problem shows up the moment you try to display the itinerary. To build a chronological view you'd have to manually merge and sort four arrays every single time — on the backend, on the frontend, everywhere. With a single `events` array it's just one `.sort()` call, and the `type` field tells you how to render each item.

The API gets messier too. Separate arrays means separate endpoints (`POST /trips/:id/flights`, `POST /trips/:id/accommodations`, etc.), versus one clean `POST /trips/:id/events` where the `type` in the request body does all the routing.

It's not that separate arrays are wrong — it's just that a single `events` array maps more naturally to how you'll actually use the data, which is almost always "give me everything for this trip in order."

---

**Me:** Is there a way a user could enter a flight number when adding a new flight and then the app could auto populate the flight details?

**AI:** Yes! There are a few APIs that let you look up flight details by flight number. The general flow would be: user types a flight number and date, the frontend sends it to your backend, your backend calls a flight data API, and the returned details auto-populate the form for the user to confirm before saving.

For a class project, **AviationStack** is the most practical starting point — it has a free tier, a straightforward REST API, and returns exactly the data you'd need. Other options include AeroDataBox (via RapidAPI) and FlightAware AeroAPI, but those are more complex or more limited on free tiers.

On the backend you'd add a lookup endpoint:

```javascript
// GET /api/flights/lookup?number=JL123&date=2026-03-20
export const lookupFlight = async (req, res) => {
  const { number, date } = req.query;

  const response = await fetch(
    `http://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATION_API_KEY}&flight_iata=${number}&flight_date=${date}`
  );

  const data = await response.json();
  const flight = data.data?.[0];

  if (!flight) return res.status(404).json({ message: 'Flight not found' });

  res.json({
    airline:      flight.airline.name,
    flightNumber: flight.flight.iata,
    from:         flight.departure.iata,
    to:           flight.arrival.iata,
    time:         flight.departure.scheduled?.slice(11, 16),
    title:        `${flight.departure.iata} → ${flight.arrival.iata}`
  });
};
```

On the Vue frontend, call that endpoint when the user finishes typing the flight number and patch the form fields:

```javascript
async function lookupFlight() {
  if (!form.flightNumber || !form.date) return;

  const res = await fetch(`/api/flights/lookup?number=${form.flightNumber}&date=${form.date}`);
  const data = await res.json();

  if (res.ok) {
    form.airline = data.airline;
    form.from    = data.from;
    form.to      = data.to;
    form.time    = data.time;
    form.title   = data.title;
  }
}
```

Trigger `lookupFlight()` either on a button click or on the `blur` event when the user tabs out of the flight number field.

One thing to watch out for: free tiers are usually rate limited and may only return data for flights within a certain time window. That's fine for a class demo, but worth checking in the docs before building around it. Store your API key in `.env` alongside your MongoDB connection string and never commit it.

---

**Me:** How easy would it be to also have a budget screen breaking down the different costs for the trip?

**AI:** Pretty straightforward, actually — the groundwork is mostly already there. Since activities already store a `cost` and `currency` field on each event, you can build a basic budget summary by just aggregating the events you're already saving.

The simplest version requires no schema changes at all. You'd add an optional `budget` field to the trip, then compute the rest from the existing events:

```javascript
// In your trip schema, just add:
budget: { type: Number, default: null },
currency: { type: String, default: 'USD' }
```

Then a backend endpoint to calculate the breakdown:

```javascript
// GET /api/trips/:id/budget
export const getTripBudget = async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });

  const breakdown = {
    accommodation: 0,
    activities:    0,
    transport:     0,
    flights:       0,
    total:         0
  };

  for (const event of trip.events) {
    if (!event.cost) continue;
    if (event.type === 'accommodation') breakdown.accommodation += event.cost;
    if (event.type === 'activity')      breakdown.activities    += event.cost;
    if (event.type === 'transport')     breakdown.transport     += event.cost;
    if (event.type === 'flight')        breakdown.flights       += event.cost;
  }

  breakdown.total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  res.json({
    budget:    trip.budget,
    remaining: trip.budget ? trip.budget - breakdown.total : null,
    breakdown
  });
};
```

On the Vue side, the budget screen is just a matter of displaying those numbers — a summary card at the top showing total spent vs. budget, and a breakdown by category below it. You could use a simple library like Chart.js or vue-chartjs to add a doughnut or bar chart without much extra work.

The main limitation to be aware of is currency — if a user adds events in mixed currencies (e.g. JPY for activities in Japan, EUR for a flight), the totals won't be meaningful without a conversion layer. For a class project the simplest fix is to just assume all costs are in the trip's base currency and note that in the UI, rather than integrating a currency conversion API.

Overall this is probably a half-day of work given everything else is already in place — it's one new endpoint, one new Vue view, and a couple of extra fields on the trip schema.

---

**Me:** How feasible would it be to have a feature where for any given event, users could upload supporting documentation (like tickets and receipts) and they could access those files whenever they look at the event?

**AI:** It's feasible but it's the most infrastructure-heavy feature we've discussed so far — the complexity isn't in the code itself but in the fact that you need somewhere to actually store the files. Your MongoDB database and Express server aren't the right place for binary files, so you'd need a dedicated file storage service.

The standard choice for this is **Cloudinary** or **AWS S3**. For a class project, Cloudinary is much easier to get started with — it has a generous free tier, a good Node.js SDK, and handles a lot of the complexity for you. S3 is more "real world" but has a steeper setup curve.

The schema change is simple — you'd just add a `documents` array to the event subdocument:

```javascript
// Add to eventSchema
documents: [
  {
    filename:  String,
    url:       String, // the Cloudinary URL
    publicId:  String, // needed to delete the file later
    uploadedAt:{ type: Date, default: Date.now }
  }
]
```

On the backend you'd use a library called `multer` to handle the file upload, then pipe it to Cloudinary:

```javascript
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/trips/:id/events/:eid/documents
export const uploadDocument = [
  upload.single('file'),
  async (req, res) => {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const event = trip.events.id(req.params.eid);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Stream the file buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `disembark/${req.user.id}` },
        (error, result) => error ? reject(error) : resolve(result)
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    event.documents.push({
      filename: req.file.originalname,
      url:      uploadResult.secure_url,
      publicId: uploadResult.public_id
    });

    await trip.save();
    res.status(201).json(event.documents);
  }
];

// DELETE /api/trips/:id/events/:eid/documents/:docId
export const deleteDocument = async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
  const event = trip.events.id(req.params.eid);
  const doc = event.documents.id(req.params.docId);

  // Delete from Cloudinary first
  await cloudinary.uploader.destroy(doc.publicId);

  event.documents.pull({ _id: req.params.docId });
  await trip.save();
  res.json({ message: 'Document removed' });
};
```

On the frontend, a file input on the event detail view posts to that endpoint, and the returned URLs are just links or thumbnail previews the user can tap to open the file.

The honest assessment for a class project: it's doable but I'd treat it as a stretch goal rather than a core feature. The Cloudinary setup, multer wiring, and handling deletes correctly adds maybe a day of work, and there are more ways for things to go wrong compared to the pure JSON features we've built so far. Get the core itinerary and budget features polished first, then add this if you have time — it would make for a impressive demo addition.

## Reflection
The AI challenged me in determining the scope of my project - what things are feasible for inclusion in the limited time we have and what things I probably shouldn't try to fit in. It suggested several things to include that I will likely end up using, such as having different types of events (flights, hotels, activities) all stored under one attribute rather than splitting them into several tables, which makes it easier to query them for making an itinerary later. It also pushed back on me and made sure I knew what was feasible; it made it clear that a file upload feature I was interested in might not be worth it to explore right now. I was right to disagree and challenge it on some of its proposals for me, but I think that through me disagreeing, the AI was able to come to a compromise that satisfied both my wants and its idea of feasibility for the project. Overall, brainstorming with AI was really useful since it approached the project with limitations in mind and helped me be real with myself about what I could implement in time.