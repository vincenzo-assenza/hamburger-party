# 🍔 HAMBURGER PARTY - Vercel Edition

Sito completo per coordinare ordini hamburger tra amici, deployato su **Vercel** (gratuito, zero costi).

**Live:** https://hamburger-party.vercel.app

---

## ✨ FEATURES

### 📄 Pagina Ordine (Pubblica)
- Form per inserire nome amico
- Selezione ingredienti con icone (lattuga, pomodoro, formaggio, patatine)
- Selezione cottura carne (al sangue, media, ben cotta)
- Animazioni Framer Motion
- Conferma visiva post-ordine
- **Mobile-first responsive**

### 🔐 Dashboard (Protetta)
- Accesso solo proprietario (email config)
- Lista ordini completi
- Eliminazione ordini singoli
- Contatore totale
- Ingredienti raggruppati per amico

### 🎨 Design
- Minimal moderno
- Palette arancione + caldo
- Animazioni fluide
- Mobile optimizzato
- Nessuna dipendenza da librerie UI

---

## 🛠️ STACK TECNICO

```
┌─────────────────────┐
│  Vercel Edge/CDN    │
├─────────────────────┤
│  Next.js 14         │
├─────────────────────┤
│  tRPC Serverless    │  (API routes)
│  React Query        │  (State management)
│  Framer Motion      │  (Animations)
├─────────────────────┤
│  Vercel Postgres    │  (Database, FREE)
└─────────────────────┘
```

**Zero dipendenze esterne:**
- ✅ Database incluso (Vercel Postgres)
- ✅ Hosting incluso (Vercel)
- ✅ SSL/HTTPS automatico
- ✅ Auto-deploy da GitHub
- ✅ Preview URLs per PR

---

## 📁 STRUTTURA PROGETTO

```
hamburger-party/
├── app/
│   ├── page.tsx                # Home (ordine pubblica)
│   ├── page.module.css
│   ├── layout.tsx              # Root layout + tRPC provider
│   └── dashboard/
│       ├── page.tsx            # Dashboard (protetta)
│       └── page.module.css
├── pages/
│   └── api/
│       └── trpc/
│           └── [trpc].ts       # API endpoint tRPC
├── lib/
│   ├── trpc-server.ts          # Router + procedures
│   └── trpc-client.ts          # Client
├── public/                     # Assets statici
├── package.json
├── next.config.js
├── tsconfig.json
├── vercel.json
├── .env.example
├── .env.local                  # Local dev (git-ignored)
├── VERCEL_DEPLOYMENT.md        # Setup guide
└── README.md
```

---

## 🚀 QUICK START

### Locale (Dev)

```bash
# Clone & setup
git clone <repo>
cd hamburger-party

# Installa dipendenze
npm install

# Crea .env.local (non pushare su git)
cp .env.example .env.local

# Dev server
npm run dev

# Apri: http://localhost:3000
```

### Deploy su Vercel

```bash
# Via Vercel CLI (fastest)
npm i -g vercel
vercel

# Via GitHub (automatic)
# Connetti repo a https://vercel.com/new
# Auto-deploy a ogni push
```

**Vedi VERCEL_DEPLOYMENT.md per guida completa step-by-step.**

---

## 🔑 ENVIRONMENT VARIABLES

Crea `.env.local` (dev) o aggiungi in Vercel Settings (prod):

```env
# Database (Vercel auto-inietta POSTGRES_PRISMA_URL)
# Niente da fare, funziona magicamente

# Authentication
JWT_SECRET=<generate: openssl rand -hex 32>
OWNER_EMAIL=your-email@example.com

# OAuth Google (opzionale)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=optional-client-id
GOOGLE_CLIENT_SECRET=optional-secret

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000  (dev)
# Production: auto-configurata su Vercel
```

---

## 📚 API ENDPOINTS (tRPC)

Tutti gli endpoint sono validati con **Zod** e type-safe end-to-end.

### Public (`/api/trpc/...`)

#### `orders.create`
```typescript
POST /api/trpc/orders.create
{
  "friendName": "Marco",
  "ingredients": { "lettuce": true, "tomato": true, "cheese": true, "fries": false },
  "meatDoneness": "medium"
}
→ { success: true, message: "..." }
```

#### `auth.verify`
```typescript
GET /api/trpc/auth.verify
→ { isAuthenticated: boolean, user?: { email, name } }
```

### Protected (Proprietario solo)

#### `orders.getAll`
```typescript
GET /api/trpc/orders.getAll
→ [ { id, friendName, ingredients, meatDoneness, createdAt }, ... ]
```

#### `orders.delete`
```typescript
DELETE /api/trpc/orders.delete
{ "id": 1 }
→ { success: true }
```

---

## 🗄️ DATABASE SCHEMA

### Users
```sql
id (SERIAL PRIMARY KEY)
email (VARCHAR UNIQUE)
name (VARCHAR)
oauth_id (VARCHAR)
is_owner (BOOLEAN)
created_at (TIMESTAMP)
```

### Orders
```sql
id (SERIAL PRIMARY KEY)
friend_name (VARCHAR)
ingredients (JSONB: {lettuce, tomato, cheese, fries})
meat_doneness (VARCHAR: rare | medium | well_done)
created_at (TIMESTAMP)
```

---

## 🎯 PERFORMANCE

**Lighthouse Scores (Target):**
- Performance: **95+**
- Accessibility: **95+**
- Best Practices: **95+**
- SEO: **95+**

**Ottimizzazioni:**
- ✅ Zero CSS framework (CSS Modules)
- ✅ Zero JavaScript dependencies (solo essenziale)
- ✅ Image optimization (nessuna immagine, solo emoji SVG)
- ✅ Code splitting automatico (Next.js)
- ✅ Caching headers automatici (Vercel CDN)

---

## 🔒 SICUREZZA

- ✅ **JWT authentication** con scadenza 30 giorni
- ✅ **Type-safe API** (Zod validation)
- ✅ **SQL injection prevention** (parametrized queries)
- ✅ **XSS protection** (React escaping automatico)
- ✅ **CORS** configurato per dominio
- ✅ **HTTPS/SSL** automatico (Vercel)
- ✅ **Rate limiting** (Vercel DDoS protection)

---

## 📱 MOBILE OPTIMIZATION

- ✅ Mobile-first CSS
- ✅ Touch-friendly buttons (min 48px)
- ✅ Viewport meta tag configurato
- ✅ Responsive images
- ✅ No horizontal scroll
- ✅ Fast form submission
- ✅ Offline-ready (service worker opzionale)

Testato su: iPhone 12, Samsung Galaxy, iPad

---

## 🧪 TESTING

```bash
# Build locale
npm run build

# Test build
npm start

# Verifica
curl http://localhost:3000/api/trpc/auth.verify
```

---

## 🚨 TROUBLESHOOTING

### "Can't connect to database"
→ Verifica `POSTGRES_PRISMA_URL` in Vercel Settings

### "404 on /dashboard"
→ Verifica `app/dashboard/page.tsx` esiste

### "Ordini non salvati"
→ Apri Vercel Postgres console: `SELECT * FROM orders;`

### "Accedi non funziona"
→ Mock login è ok per dev. Per OAuth reale: setup Google Cloud Console

---

## 📈 ROADMAP (Opzionale)

- [ ] NextAuth.js + OAuth Google reale
- [ ] Email notifications (Resend)
- [ ] Webhook per notifiche
- [ ] Esportazione PDF ordini
- [ ] Dark mode
- [ ] Timer cottura
- [ ] Analytics (Vercel Analytics)
- [ ] Custom domain

---

## 💰 COSTI

| Servizio | Costo |
|----------|-------|
| Vercel Hosting | **$0** (free tier illimitato) |
| Vercel Postgres | **$0** (256MB free) |
| SSL Certificate | **$0** (auto) |
| CDN Bandwidth | **$0** (100GB/mese) |
| **TOTALE MENSILE** | **$0** |

✅ Completamente gratuito per sempre.

---

## 📞 SUPPORT

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **tRPC Docs**: https://trpc.io/docs
- **Postgres Docs**: https://www.postgresql.org/docs

---

## 📄 LICENSE

MIT

---

**Created with ❤️ for Hamburger Party 🍔**

**Deploy in 5 minutes. Enjoy forever. 🚀**
