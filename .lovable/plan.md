
Got it — white slate so it pops against the matte black site. Here's the revised plan:

## What it looks like

A floating widget pinned bottom-right on every page (except `/bid-desk-app` to avoid covering the app UI). Closed state = mini white clapperboard, ~180px wide:

```text
 ┌──────────────────────────────┐
 │ ▞▞▞ ▚▚▚ ▞▞▞ ▚▚▚ ▞▞▞ ▚▚▚ ▞▞▞ │  ← black/gold striped clapper sticks
 ├──────────────────────────────┤
 │  PRODUCTION BID DESK         │  ← black text on white slate
 │  SCENE: HELP   TAKE: 01      │
 │  ──────────────────────      │
 │  [ Need help? Tap to chat ]  │
 └──────────────────────────────┘
```

- White/cream slate body (`#F5F5F0`) with subtle shadow so it lifts off the black bg
- Black handwritten-style text (Manrope, slight letter-spacing)
- Gold trim (`#D4AF37`) on the clapper sticks edge for brand consistency
- Gentle "clap" animation every 8 seconds to draw the eye

## Open state

Click → expands to a 360px panel still styled like the slate:
- Header: "How can we help?" + close X
- Quick-action chips: "Pricing question" · "Demo request" · "Technical help"
- Optional name + email fields
- Message textarea
- Gold "ACTION" send button (clapperboard-themed)
- After submit: "Cut! We got it. We'll be in touch shortly."

## What gets built

**New file:** `src/components/ClapperboardWidget.tsx` — the widget, open/close state, form, submit handler

**Edited:** `src/App.tsx` — mount the widget globally, conditionally hide on `/bid-desk-app`

**Backend:**
- New table `support_messages` (id, user_id nullable, name, email, topic, message, created_at)
- RLS: anyone (incl. anonymous) can INSERT; only authenticated owner can SELECT their own
- Form submits via Supabase client → row inserted → toast confirmation

## Out of scope (can add later)
- Email notification to you when a message comes in (needs an edge function + email connector)
- Admin inbox page to read messages

Approve and I'll build it.
