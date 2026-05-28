# 🚀 DEPLOY SU VERCEL IN 5 MINUTI

Tutto pronto per deployare su Vercel. Segui questi step.

---

## PASSO 1: Prepara il Repository

```bash
# Crea cartella progetto
mkdir hamburger-party
cd hamburger-party
git init

# Copia tutti i file nella struttura giusta:
# - pages/api/trpc/[trpc].ts     (tRPC endpoint)
# - app/page.tsx                 (Home ordine)
# - app/page.module.css
# - app/dashboard/page.tsx       (Dashboard)
# - app/dashboard/page.module.css
# - lib/trpc-server.ts
# - lib/trpc-client.ts
# - package.json
# - next.config.js
# - tsconfig.json
# - .env.local (locale, non pushare)

git add .
git commit -m "Initial commit: Hamburger Party"
git remote add origin https://github.com/YOUR_USERNAME/hamburger-party.git
git branch -M main
git push -u origin main
```

---

## PASSO 2: Crea Vercel Postgres Database

1. **Vai a** https://vercel.com/dashboard
2. **Storage** → New Database → Postgres
3. **Create**
4. Copia la connection string `POSTGRES_PRISMA_URL`
5. **Apri il console**:
   ```sql
   -- Copia e incolla il contenuto di init-db.sql
   -- nella query editor di Vercel Postgres
   ```

---

## PASSO 3: Deploy Frontend + Backend su Vercel

### Via Vercel CLI (2 secondi):

```bash
npm install -g vercel
vercel login

# Dalla root cartella
vercel
```

Vercel ti chiederà:
- Project name: `hamburger-party`
- Framework: `Next.js`
- Root directory: `.` (current)

**Boom! Deployato.**

### Oppure: Via GitHub UI (più facile)

1. **Vai a** https://vercel.com/new
2. **Import GitHub repo** → Select `hamburger-party`
3. **Automatic** → Next.js framework riconosciuto
4. **Environment variables** (vedi passo 4)
5. **Deploy**

---

## PASSO 4: Aggiungi Environment Variables

Nel dashboard Vercel del tuo progetto:

**Settings → Environment Variables**

Aggiungi:
```
JWT_SECRET = <copia da openssl rand -hex 32>
OWNER_EMAIL = your-email@example.com
POSTGRES_PRISMA_URL = <copia da Vercel Postgres>
```

Clicca **Save and Redeploy**

---

## PASSO 5: Verifica Deployment

1. **Vai a**: `https://hamburger-party.vercel.app`
2. **Testa ordine**:
   - Inserisci nome
   - Seleziona ingredienti
   - Clicca "Ordina"
   - Vedi conferma ✅
3. **Testa dashboard**:
   - Vai a `/dashboard`
   - Accedi (dev: click "Accedi con Google")
   - Vedi ordini salvati ✅
   - Elimina ordine ✅

---

## ✅ DEPLOYMENT FINITO

| Componente | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Online | `https://hamburger-party.vercel.app` |
| Backend API | ✅ Serverless | Auto-incluso |
| Database | ✅ PostgreSQL | Vercel Postgres |
| SSL/HTTPS | ✅ Auto | Vercel |

---

## 🔑 ENVIRONMENT VARIABLES COMPLETO

```env
# Database (AUTO da Vercel Postgres)
POSTGRES_PRISMA_URL=postgresql://[auto-injected]

# Auth
JWT_SECRET=<generate: openssl rand -hex 32>
OWNER_EMAIL=you@gmail.com

# OAuth Google (OPZIONALE - per login reale)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# API URL (AUTO su Vercel)
NEXT_PUBLIC_API_URL=https://hamburger-party.vercel.app
```

---

## 🔐 CONFIGURARE GOOGLE OAUTH (Opzionale)

Se vuoi il vero login Google (non il mock):

1. **Google Cloud Console**: https://console.cloud.google.com
2. **Nuovo progetto** → "Hamburger Party"
3. **APIs & Services** → Create Credentials → OAuth 2.0 Client ID
4. **Application type**: Web application
5. **Authorized redirect URIs**:
   ```
   https://hamburger-party.vercel.app/api/auth/callback/google
   ```
6. **Copia** Client ID e Secret → Vercel Environment Variables

---

## 📊 LIMITS VERCEL (Gratis)

| Feature | Limit |
|---------|-------|
| Bandwidth | 100GB/mese |
| Serverless Functions | 1000 invocazioni/giorno |
| Build time | 45 min/mese |
| Database | 256MB (Postgres) |
| **Cost** | **$0** |

✅ Per Hamburger Party: **Perfetto**, sei abbondantemente sotto i limiti.

---

## 🚨 TROUBLESHOOTING

### "Database connection refused"
```
Soluzione: 
1. Verifica POSTGRES_PRISMA_URL è corretta in Vercel Settings
2. Verifica init-db.sql è stato eseguito nella console Postgres
3. Rideploy: vercel --prod
```

### "404 on /api/trpc"
```
Soluzione:
1. Verifica pages/api/trpc/[trpc].ts esiste
2. npm run build locale e testa
3. Rideploy
```

### "Ordini non salvati"
```bash
# Debug: accedi alla console Postgres di Vercel
SELECT * FROM orders;  # Dovrebbe mostrare dati
SELECT * FROM users;   # Dovrebbe mostrare utenti
```

### "Accedi con Google non funziona"
```
Opzione A: Rimani con mock login (è ok per test)
Opzione B: Configura NextAuth.js + Google OAuth (più complesso)
```

---

## 🎉 FATTO!

**Il tuo sito è live su Vercel, completamente gratuito.**

### Prossimi step (opzionali):
- [ ] Aggiungere NextAuth.js per OAuth reale
- [ ] Aggiungere email notifications (Resend)
- [ ] Aggiungere analytics (Vercel Analytics)
- [ ] Custom domain (`hamburger-party.it`)
- [ ] Backup automatici database

---

## 📱 MOBILE TEST

Apri su smartphone:
```
https://hamburger-party.vercel.app
```

Dovrebbe:
- ✅ Essere responsive (mobile-first)
- ✅ Mostrare icone emoji grandi
- ✅ Form facile da compilare
- ✅ Animazioni fluide

---

**Buona serata! 🍔🎉**

Per domande: https://vercel.com/docs
