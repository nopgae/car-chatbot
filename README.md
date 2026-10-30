# AutoAssist - Car Chatbot

A small web chatbot for car questions (prices, specs, comparisons). Built in March 2025 as an early project to learn how to connect a static frontend to an LLM API through a Node.js backend.

## How it works

```
frontend/ (static HTML/CSS/JS, GitHub Pages)
   │  POST /api/chat  { message, image? }
   ▼
backend/server.js (Express)
   ├─ question matches a car in the built-in table → answer locally (no API call)
   └─ otherwise → Claude (claude-opus-5-5, Messages API) with a car-assistant system prompt;
      an attached photo is sent as an image block so Claude can identify the car
```

- The built-in table has 3 cars (Toyota Camry, Honda Accord, Tesla Model 3), duplicated in `frontend/script.js` and `backend/server.js`.
- The frontend also answers questions about those 3 cars itself, without calling the backend.

## Run locally

```bash
cd backend
npm install
cp .env.example .env      # set ANTHROPIC_API_KEY (from https://console.anthropic.com/)
npm start                 # http://localhost:3000, health check at /health
npm test                  # offline: the Claude call is stubbed

# in another terminal
cd frontend
npx http-server           # http://localhost:8080
```

On `localhost` the frontend calls `http://localhost:3000/api/chat`. For a deployed backend, set `API_ENDPOINT` in `frontend/script.js`. `CORS_ORIGIN` in `.env` must include the frontend's origin.

## Limitations

- Photo identification is only as good as the model's guess from one image; there is no car-specific vision model.
- The GitHub Pages deployment has no backend configured (`API_ENDPOINT` is a placeholder), so on the hosted page only questions about the 3 built-in cars get an answer.
- Car data is a 3-entry hardcoded table with 2025 list prices typed in by hand; no external data source.
- No auth or rate limiting, so a public deployment would let anyone spend your API credits. Tests stub the Claude call, so the live API request itself is not covered.

## Tech stack

HTML/CSS/JavaScript · Node.js · Express · Anthropic SDK (`@anthropic-ai/sdk`) · GitHub Actions → GitHub Pages
