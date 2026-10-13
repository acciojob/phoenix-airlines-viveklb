# Phoenix Airlines

A responsive flight-search and booking experience built with React and Redux.

## Run locally

```sh
npm install
npm start
```

The development server runs at `http://localhost:8080`. Create a production build with `npm run build`.

## Booking flow

- `/` — Landing page and flight-search entry points.
- `/flight-search` — Search one-way or round-trip journeys and select a flight.
- `/flight-booking` — Enter and validate passenger contact details.
- `/confirmation` — Review the confirmed itinerary and booking code.

Flight options are demo inventory. Redux holds the selected itinerary and passenger details for the current browser session.
