# Reflection

Answer the following five questions. Aim for 100–200 words per question. Bullet points are fine.

## Q1 — Scope decisions
### Compare your original BRIEF.md feature list to what you actually built. What did you cut, add, or change, and why?
My BRIEF.md feature list matches what I actually built very well. I changed minor implementation details, but I followed my planned API routes, data models, and feature set almost exactly. The UI in some ways ended up being simpler than what I planned. For example, it ended up having less distinction between how a flight and a hotel reservation event are stored to make the itinerary functionality simpler. I also added several quality of life features along the way to make user experience better, such as better handling of dates/times to make it easier to make a new event. Overall, I mostly stuck to exactly what I laid out in my brief when possible though.

## Q2 — Technical challenge
### Describe the single hardest technical problem you encountered. What was the error or obstacle, and how did you resolve it?
The hardest technical problem I encountered was getting the frontend and backend properly deployed, as it was something I hadn't really come across before and took some time to resolve. For the backend, I wanted to use Railway, but it cut off my access due to my free trial ending, so I had to switch over to Render. In addition, compared to the QuizBlitz project, I had a monorepo that stored both the backend and frontend here, so Render couldn't automatically recognize what to run as the service. I was able to resolve this issue by looking through documentation and asking AI for advice, which led me to manually setting a "root directory" in Render settings. The frontend deployment also ended up having weird issues when trying to deploy with GitHub Pages. This was also something I resolved by asking AI to analyze my files and build process and make sure there was nothing missing.

## Q3 — AI and vibe-coding
### Reflect on your use of Claude Code during development. Give two specific examples: one where the AI output worked well with minimal changes, and one where you had to significantly debug or rewrite what it gave you. What did you learn from the difference?
One example where the AI output worked well with minimal changes was the initial setup of the backend (including database models and routes). The AI was able to follow my brief exactly as written, creating correct routes and models with correct initial functionality. There were only a few minor additions I had to put to make it work well with other parts of the project. One that I had to significantly debug/rewrite was a lot of smaller frontend elements. I had the AI scaffold a lot of the initial frontend components without styling at first. While it made a good initial setup, there were several little functionality details that were nonfunctional or would not be comfortable for users to utilize. This required a lot of debugging and rewriting of small elements. I learned from both of these experiences that AI can be really good at scaffolding and setting up core parts of a program (whether backend or frontend), but a programmer still needs to understand what's going on under the hood of the program, as AI will frequently make small mistakes that need targeted debugging.

## Q4 — Architecture
### Explain how data flows through your application for one specific user action — from the moment the user clicks something, through the front-end, the API, the database, and back to the screen.
Flow for editing a flight for a given trip:
- User logs in to account with username and password
    - Frontend sends credentials to login API route
    - Backend verifies credentials against database and logs frontend in if valid
- Backend fetches trips from database for given user and serves frontend with trips page
- User clicks on given trip, backend fetches that trip's events from database and serves frontend with list of events for that trip
- User clicks edit on flight event, frontend presents UI for editing flight details
- User changes details on the frontend such as time, airline, date, etc.
- User presses "Update Event", frontend calls API route to update fields on the backend/database
- Changes are persisted in the database and shown on the frontend

## Q5 — If you had two more weeks
### What would you add or improve first, and what technical approach would you use?
First, I would try to add small features improving user experience little by little to gradually make the app better and simpler to use, with less manual effort required on the user's part. For example, I would want to implement proper currency handling/conversion, automatic flight lookup, and the ability to upload corresponding documentation (like a ticket) for each event. I would use the technical approach of building these features one by one through gradual commits, focusing on fleshing out features and making sure they're properly implemented and then moving to the next one. This approach would move the app beyond just proof-of-concept implementation of my brief and make it genuinely much nicer to use.