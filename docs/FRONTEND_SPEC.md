# Curais Frontend Specification

## Notifications and validation

Both Patient and Doctor apps use the shared glassmorphism toast viewport at the top-right on desktop and full-width near the top on mobile.

- `error`: failed network, authentication, authorization, load, or save action.
- `success`: completed save, creation, consent, or invitation action.
- `info`: neutral workflow outcome that does not require correction.
- `warning`: consequential but successful action or caution, such as consent revocation.

Toasts are dismissible, stack to four visible items, use accessible live regions, and normally close after six seconds. Field-level validation stays inline beneath the relevant input and moves focus to the first invalid field. Loading state stays next to the active control/content; it is not a toast.

## Information architecture

R1 has one immediate-care experience. R2 introduces a patient home with **Immediate Care**, **My Health**, and **Care Team**. Clinic users access a distinct, clearly labelled workspace; never mix clinical controls into the emergency flow.

## Immediate Care flow

1. Home: Curais wordmark, “Get help now” symptom entry, common emergency buttons, persistent emergency CTA.
2. Input: voice/text support, clear data-use notice, character limit, and loading state.
3. Result: emergency CTA first; possible concern and concise action line; numbered steps; red flags; disclaimer; “save to My Health” only for signed-in users who opt in.
4. Error/offline: say what is unavailable, retain curated quick-aid options and emergency CTA.

## Visual direction

- Brand personality: calm, capable, human, never alarmist except when escalation is needed.
- Core palette: deep teal/ink for trust, soft mint/ivory backgrounds, emergency red reserved solely for urgent actions.
- Typography: rounded, high-legibility sans for headings and a neutral text face; support Devanagari and other target scripts.
- Logo use: compact symbol + wordmark; the emergency module may use “Curais / Immediate Care,” not a separate competing master brand.

## Accessibility and interaction requirements

- Meet WCAG 2.2 AA: contrast, keyboard navigation, visible focus, semantic headings, labelled controls, and status announcements.
- Touch targets minimum 44 by 44 CSS pixels.
- Never rely on color alone for critical/basic status.
- Keep emergency CTA available on every mobile result screen without obscuring content.
- Reduce animation when `prefers-reduced-motion` is enabled.

## Responsive behavior

- Design mobile first from 320px width; one-column urgent flow.
- Tablet/desktop may widen reading cards but preserve the first action and emergency CTA above the fold.
- Treat slow/unstable networks as normal: low-weight assets, skeleton/loading states, no blocking animation.

## Key UI states

| State | Required behavior |
| --- | --- |
| Emergency intent | show direct action and curated guidance immediately |
| AI loading | disable duplicate submit, keep emergency call accessible |
| Invalid/unsafe result | show retry plus emergency/safety path; do not render partial guidance |
| Signed out | allow immediate care; explain sign-in benefit before saving |
| Consent required | concise purpose, data categories, retention, revoke link |
