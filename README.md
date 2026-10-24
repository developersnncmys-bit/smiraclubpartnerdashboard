# Smira Partner Dashboard

The partner side of Smira Club, served at **https://partner.smiraclub.com**.
Hotels, villas and other partners register, sign in, and manage their own
listings, rates, bookings and payouts. Installable on a phone as **Smira Partner**.

It talks to the same API as the admin panel, `https://api.smiraclub.com/api`.

| Address | Page |
|---|---|
| `/` | Partner dashboard (sends you to `/login` if not signed in) |
| `/login` | Partner sign-in and registration |
| `/partner`, `/partner/login` | Old addresses, redirected |

## Run it on your computer

```bash
npm install
npm run dev
```

Opens on http://localhost:5176. The dev server forwards `/api` to the live API
(see `vite.config.js`), because the live API does not accept `localhost`
as an origin.

## Build

```bash
npm run build
```

The site is the `dist/` folder: plain files, served by nginx.

## Deploy on the VPS

```bash
cd ~/smiraclub/partner
git pull origin main
npm install
npm run build
cp -r dist/* /var/www/smiraclub-partner/
systemctl reload nginx
```
