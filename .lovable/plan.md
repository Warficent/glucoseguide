## Dexcom CGM Integration — Architecture (planning only, no code)

This is a design doc for later. Nothing gets built yet.

### Why not direct Bluetooth
Dexcom G6/G7 transmitters broadcast on BLE, but the payload is AES-encrypted and paired to Dexcom's own receiver or phone app. Web Bluetooth cannot decrypt it, and doing so unofficially violates Dexcom's terms and FDA constraints. Any real integration goes through Dexcom's cloud, not the sensor.

### Recommended path: Dexcom Share via the official API

```text
 Dexcom Sensor ──BLE──> Dexcom mobile app ──> Dexcom Cloud
                                                    │
                                        OAuth 2.0   │  (readings, 5-min delay)
                                                    ▼
                                          Glucose Guide server
                                                    │
                                                    ▼
                                          Glucose Guide UI
```

- Sandbox: `https://sandbox-api.dexcom.com` — free, fake data, for development
- Production: `https://api.dexcom.com` — requires Dexcom review + approval before go-live
- Endpoint we care about: `GET /v3/users/self/egvs` (estimated glucose values)
- Latency: readings arrive ~5 minutes behind the sensor

### What we'd need to build

1. **Accounts & storage** (requires Lovable Cloud)
   - Auth so each patient's Dexcom tokens are scoped to them
   - `cgm_connections` table: `user_id`, `access_token`, `refresh_token`, `expires_at`, `provider` — RLS locked to owner
   - `glucose_readings` table replacing today's `localStorage` history

2. **Dexcom app registration** (user does this once)
   - Sign up at developer.dexcom.com, create an app, get Client ID + Secret
   - Set redirect URI to `https://<app>.lovable.app/api/dexcom/callback`
   - Secrets stored via Lovable Cloud secrets, never in code

3. **OAuth flow** (server routes, not client)
   - `GET /api/dexcom/connect` → redirects to Dexcom authorize URL
   - `GET /api/dexcom/callback` → exchanges code for tokens, saves to DB
   - Server function `refreshDexcomToken()` — refresh tokens expire, must rotate

4. **Reading sync**
   - Server function `fetchLatestReading(userId)` → calls Dexcom `/egvs`, upserts newest reading
   - Polling: client `useQuery` with `refetchInterval: 60_000` calls the server function
   - Optional later: pg_cron hitting `/api/public/cron/sync-cgm` for background refresh even when app is closed

5. **UI changes**
   - Settings screen: "Connect Dexcom" button + status ("Connected · last reading 2 min ago")
   - Home gauge reads from `glucose_readings` (live) instead of manual entry
   - Manual entry stays as fallback for users without Dexcom
   - Trend chart pulls straight from the readings table — no more 100-entry cap

6. **Safety**
   - Show "Reading is X minutes old" — Dexcom Share is not real-time
   - Disclaimer that this is informational, not a medical device — the sensor and Dexcom app remain the source of truth
   - Emergency banner logic already exists and continues to apply

### Open questions to resolve before build
- Multi-user or single-user app? (drives whether we need auth + Cloud, or just one connection)
- Do we also want Nightscout as a second option (helps users who don't want to register a Dexcom developer app)?
- Retention policy for readings (30 days? forever?)

### Not doing
- Direct BLE to the sensor
- Reverse-engineering the Dexcom BLE protocol
- Reading from the phone's Dexcom app storage
- Real-time push (Dexcom API is pull-only)

When you're ready to actually build this, we'll start with step 1 (enable Lovable Cloud + auth) and go from there.