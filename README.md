# AzCon FlowAI

AI-powered smart mobility demo for predicting metro and bus congestion from iTicket event demand.

## Demo Flow

1. Open the animated homepage.
2. Review the iTicket Smart Integration section.
3. Paste a demo iTicket event link.
4. Mock AI extracts event details and predicts congestion.
5. Event impact map and live mobility dashboard update.
6. Operator dashboard shows recommended transport actions.

## Routes

- `/` - premium homepage and demo flow.
- `/operator` - operator control-room dashboard.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

The iTicket import, AI extraction, prediction engine, route planner, alerts, and operator actions are mock MVP layers for a hackathon demo. The code is structured so real iTicket, OpenAI/Gemini, metro, BakuBus, notification, and announcement APIs can replace the mock providers later.
