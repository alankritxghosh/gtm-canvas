<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Agentic GTM Canvas. Here's a summary of all changes made:

**Environment & configuration**
- Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`
- Updated `next.config.ts` to add PostHog reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` — this routes PostHog traffic through your own domain to improve ad-blocker resilience
- Updated `PosthogProvider.tsx` to use the `/ingest` proxy as `api_host`, enabled `capture_exceptions: true` for automatic error tracking, and set `defaults: '2026-01-30'`

**New events instrumented (9 total)**

| Event | Description | File |
|---|---|---|
| `example_input_used` | User clicked "Try an Example" to pre-fill trigger input | `src/components/TriggerNode.tsx` |
| `strategy_generation_failed` | Strategy generation failed (API error or empty response) | `src/components/TriggerNode.tsx` |
| `agent_deep_dive_started` | User clicked "DEEP DIVE" to expand a pillar node | `src/components/AgentNode.tsx` |
| `agent_expanded` | Deep dive completed — new action nodes added to canvas | `src/components/AgentNode.tsx` |
| `agent_expansion_failed` | Agent expansion failed (API error or empty response) | `src/components/AgentNode.tsx` |
| `artifact_viewed` | User clicked an action node to view its content in the side panel | `src/components/ActionNode.tsx` |
| `artifact_copied` | User copied artifact content to clipboard | `src/components/SidePanel.tsx` |
| `strategy_generated_server` | Server-side: strategy generation API succeeded | `src/app/api/generate/route.ts` |
| `agent_expanded_server` | Server-side: agent expand API succeeded | `src/app/api/expand/route.ts` |

**Previously existing events also enriched**
- `strategy_generated` — added `pillar_count` property
- `artifact_exported` — unchanged (already well-instrumented)

**Error tracking**
- Added `posthog.captureException(e)` to the catch blocks in `TriggerNode.tsx` and `AgentNode.tsx` for automatic exception capture on AI generation failures

## Next steps

We've built a dashboard and five insights to keep an eye on user behavior:

**Dashboard**
- [Analytics basics](https://us.posthog.com/project/335308/dashboard/1341251)

**Insights**
- [GTM Strategy Conversion Funnel](https://us.posthog.com/project/335308/insights/9QYNfUug) — 4-step funnel: Strategy Generated → Deep Dive → Artifact Viewed → PDF Exported
- [Core Activity Trends](https://us.posthog.com/project/335308/insights/ZrReiZts) — Daily line chart of strategies generated, deep dives, and exports
- [Error Rate: Generation Failures](https://us.posthog.com/project/335308/insights/qcoQkla6) — Tracks strategy and agent expansion failures over time (churn signal)
- [Artifact Engagement: Views vs Copies vs Exports](https://us.posthog.com/project/335308/insights/Ei9zJvS9) — How users engage with artifacts after viewing them
- [Example vs Custom Input Usage](https://us.posthog.com/project/335308/insights/h8vjjqIY) — Are users exploring via example or bringing their own product ideas?

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
