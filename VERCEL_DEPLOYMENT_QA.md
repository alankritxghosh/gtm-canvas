# 🚀 Vercel Deployment Checklist & QA Script

## 1. Environment Variable Manifest

When importing the GitHub repository into Vercel, copy and paste the following variables.

**🔴 SERVER-ONLY SECRETS (Do NOT prefix with NEXT_PUBLIC)**
These are safely isolated on the Edge runtime.
- \`GEMINI_API_KEY\` = `[Your Gemini 3.1 Pro / Flash Key]`
- \`UPSTASH_REDIS_REST_URL\` = `[Your Upstash Redis REST URL]`
- \`UPSTASH_REDIS_REST_TOKEN\` = `[Your Upstash Redis REST Token]`

**🟢 PUBLIC CLIENT VARIABLES**
These are injected into the frontend.
- \`NEXT_PUBLIC_SITE_URL\` = `https://[your-actual-vercel-domain].vercel.app` (CRITICAL FOR CORS)
- \`NEXT_PUBLIC_POSTHOG_KEY\` = `[Your PostHog Project API Key]`
- \`NEXT_PUBLIC_POSTHOG_HOST\` = `https://us.i.posthog.com` (Or European equivalent)

---

## 2. Post-Deploy QA Script

Execute the following 3 tests the exact second your Vercel deployment goes live to guarantee zero-trust security and functional telemetry:

### Test A: Strict CORS Boundary
From your local terminal, simulate an unauthorized cross-origin request to your live API.

```bash
curl -X POST https://[your-actual-vercel-domain].vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -H "Origin: https://malicious-website.com" \
  -d '{"input": "B2B SaaS"}' \
  -I
```
**Expected Result:** You should receive an `HTTP 403 Forbidden` response from the Edge middleware blocking the request.

### Test B: The Bankruptcy Defense (Upstash Rate Limiter)
Spam the "Generate" button on the live Vercel web app extremely fast (more than 10 times).

**Expected Result:** On the 11th click, the request should fail safely without crashing the UI. A dark-mode Sonner toast will appear saying: `"Agent overloaded. Recalibrating strategy..."`, and if you check the network tab, the API returned an `HTTP 429 Too Many Requests`.

### Test C: Telemetry Verification
1. Click the "Generate" button once.
2. Click any node to open the Right-Hand Side Panel.
3. Click the neon green "Export" PDF button.
4. Immediately log into your PostHog Dashboard -> Activity -> Events.

**Expected Result:** You should see two custom events logged in real-time from your IP:
- `strategy_generated` (Triggered from `TriggerNode.tsx`)
- `artifact_exported` (Triggered from `SidePanel.tsx`)
