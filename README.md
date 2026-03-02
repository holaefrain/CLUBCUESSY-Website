# CLUBCUESSY

**A music event collective based in Provo, UT** — pushing the boundaries of dance, movement, and sound.

Live site: [www.clubcuessy.com](https://www.clubcuessy.com)

---

## About

CLUBCUESSY is a medium in which art and music can coincide within each other. We are an independent music event organization dedicated to creating immersive, judgment-free dance experiences. Built on three core principles — the Rite of Dance, the Law of Liberation, and the Anonymous Performance Act — every event is designed to strip away ego and connect people through sound and movement.

---

## Pages

| Page | Description |
|------|-------------|
| `/HomePage` | Landing page with video background and upcoming event poster |
| `/Standards` | The Standards of Movement — the ethos behind every event |
| `/Upcoming-Events` | Current and future event posters |
| `/Event-Description` | Detailed event info and Stripe ticket purchasing |
| `/Archives` | Gallery of past event posters |
| `/Articles` | Blog with searchable articles and a carousel |
| `/Contact` | Contact form for reaching the team |

---

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Payments:** Stripe (Pricing Tables + Payment Intents)
- **Email:** Resend
- **Music Player:** SoundCloud Widget API
- **Hosting:** GitHub Pages / Node server for payment processing

---

## Getting Started

### Prerequisites
- Node.js v18+
- A Stripe account
- A `.env` file (see below)

### Installation
```bash
git clone https://github.com/holaefrain/CLUBCUESSY-Website.git
cd CLUBCUESSY-Website
npm install
```

### Environment Variables

Create a `.env` file in the root directory:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> Never commit your `.env` file. It is already listed in `.gitignore`.

### Running Locally
```bash
npm start
```

The site will be available at `http://localhost:3000`.

---

## Project Structure
```
CLUBCUESSY-Website/
├── HomePage/
├── Standards/
├── Upcoming-Events/
├── Event-Description/
├── Archives/
├── Articles/
├── Contact/
├── server.js
├── index.html
└── .env (not committed)
```

---

## Stripe Integration

Ticket purchasing is handled via Stripe. The server exposes two endpoints:

- `POST /create-payment-intent` — creates a Stripe PaymentIntent
- `POST /webhook` — listens for Stripe webhook events

The frontend uses a Stripe Pricing Table embedded in the event description page.

---

## License

MIT — see [LICENSE.md](LICENSE.md)

---

*Still building this out. Bear with us.*

## Versions
1.0 - The Great Big Leap - March 2, 2026
- CLUBCUESSY Website is fully operational, including pricing table for customer payments.
- Contact Form doesn't send anywhere specifically, with intention to route to an appropriate email address (hola@clubcuessy.com)
- Email Automation: This will be created separately, but will work in conjoining ticket purchases with automated emails for more event information (contact me if you want to help)
