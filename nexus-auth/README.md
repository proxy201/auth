# 🔐 Nexus Auth

> Production-ready glassmorphic authentication — Next.js 14 · Aiven MySQL · bcrypt · JWT

---

## ✨ Features

| | |
|---|---|
| **Two auth pages** | Glassmorphic Login & Signup with staggered animations |
| **Username auth** | Name + password (+ confirm password on signup) |
| **bcrypt hashing** | Cost factor 12 — passwords are *never* stored in plaintext |
| **JWT sessions** | HttpOnly cookie, 7-day expiry, protected from XSS |
| **Route guard** | Middleware blocks unauthenticated access to all private routes |
| **Password strength** | Live indicator updates as you type |
| **Toast notifications** | Animated success / error toasts |
| **Aiven MySQL** | SSL/TLS, auto-creates `users` table on first run |
| **Vercel ready** | Zero-config deploy |

---

## 🚀 Quick Start

### 1. Install

```bash
unzip nexus-auth.zip && cd nexus-auth
npm install
```

### 2. Configure

```bash
cp .env.local.example .env.local
# Then edit .env.local with your real values (see below)
```

### 3. Initialise the database

```bash
npm run db:init
```

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000  (auto-redirects to /login)
```

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DB_HOST` | ✅ | Aiven MySQL host, e.g. `mysql-xxx.aivencloud.com` |
| `DB_PORT` | ✅ | Aiven MySQL port |
| `DB_USER` | ✅ | Usually `avnadmin` |
| `DB_PASSWORD` | ✅ | Your Aiven service password |
| `DB_NAME` | ✅ | Usually `defaultdb` |
| `DB_SSL` | ✅ | Must be `true` for Aiven |
| `JWT_SECRET` | ✅ | Long random string (`openssl rand -base64 64`) |
| `JWT_EXPIRES_IN` | — | Default `7d` |
| `NEXT_PUBLIC_REDIRECT_URL` | ✅ | URL to send users after successful login/signup |

---

## 🌐 Deploy to Vercel

### A — Dashboard (recommended)

1. Push to GitHub
2. Vercel → **New Project** → import repo
3. Add each env variable from the table above
4. **Deploy** 🎉

### B — CLI

```bash
npm i -g vercel
vercel
# add env vars when prompted
vercel --prod
```

---

## 🗄️ Aiven MySQL

1. Log in at [console.aiven.io](https://console.aiven.io)
2. Create a **MySQL** service (free tier works)
3. Go to **Service overview → Connection information**
4. Copy Host, Port, User, Password → paste into `.env.local`

The `users` table is created automatically on the first API call, or run:

```bash
npm run db:init
```

### Schema

```sql
CREATE TABLE users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,   -- bcrypt, NEVER plaintext
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_name (name)
);
```

---

## 📂 Project Structure

```
nexus-auth/
├── scripts/
│   └── init-db.js              ← run once to create DB table
├── src/
│   ├── app/
│   │   ├── api/auth/
│   │   │   ├── signup/route.ts ← POST — register user
│   │   │   ├── login/route.ts  ← POST — authenticate
│   │   │   ├── logout/route.ts ← POST — clear cookie
│   │   │   └── me/route.ts     ← GET  — current user
│   │   ├── login/page.tsx      ← Login page
│   │   ├── signup/page.tsx     ← Signup page
│   │   ├── dashboard/page.tsx  ← Protected fallback dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx            ← Root → redirects to /login
│   │   └── globals.css         ← Full glassmorphic design system
│   ├── components/ui/
│   │   ├── SceneBg.tsx         ← Animated background blobs
│   │   ├── NexusLogo.tsx       ← SVG logo + wordmark
│   │   ├── InputField.tsx      ← Glass input with show/hide password
│   │   ├── PasswordStrength.tsx← Live strength bar
│   │   └── Toast.tsx           ← Animated notifications
│   ├── lib/
│   │   ├── db.ts               ← Aiven MySQL pool + query helpers
│   │   ├── auth.ts             ← JWT sign/verify + cookie helpers
│   │   ├── validation.ts       ← Zod schemas
│   │   └── api.ts              ← Response helpers
│   └── middleware.ts           ← Route protection
├── .env.local.example
├── vercel.json
└── package.json
```

---

## 🔒 Security Notes

- `bcrypt` cost = **12** → ~250ms per hash → brute-force resistant
- JWT stored in **HttpOnly cookie** → not accessible from JavaScript → XSS safe
- Login uses **constant-time comparison** even when user doesn't exist → prevents timing attacks
- Error message is **generic** ("Invalid username or password") → prevents username enumeration
- Aiven enforces **SSL/TLS** on every connection

---

## 🎨 Customising

**Redirect URL** — set `NEXT_PUBLIC_REDIRECT_URL` in env to your app.

**Brand name** — search-replace `Nexus` across the codebase.

**Colours** — edit CSS variables in `globals.css` (`:root` block).
