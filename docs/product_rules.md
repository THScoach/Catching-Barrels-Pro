# Catching Barrels: Marketing & Product Strategy Rules

## 1. Core Brand Identity & Terminology
* **Primary Metric:** Always use the term "Kinetic Fingerprint" to describe a player's unique swing profile.
* **The 4B Framework:** All analysis and UI must be categorized into Body, Brain, Bat, and Ball.
* **Efficiency Standard:** Reference the "Freeman Efficiency Ratio" (1.30x) to explain why contact quality and sequencing matter more than raw bat speed.
* **Philosophy:** Optimize the hitter's natural pattern (BioSwing Dynamics) rather than forcing a universal mechanical fix.

## 2. Product Tiers & Funnel Logic
The agent must ensure the app flow supports these specific tiers:
* **Free Preview:** Requires 1 video upload; provides a high-level snapshot but no continuous tracking.
* **Community ($39/mo):** Requires the $97 Starter Kit (DK Sensor). Includes full Kinetic Fingerprint tracking and AI community access.
* **Full ($79/mo):** All Community features plus Monday Live Coaching Calls.

## 3. Technical Implementation Constraints
* **Invisible Infrastructure:** Users must never leave the app to use the Diamond Kinetics (DK) app.
* **Sensor Pairing:** Implementation must use serial-based Bluetooth pairing within the Catching Barrels UI.
* **Video Triggers:** Video capture should be "Sensor-Triggered." The sensor detects impact and extracts a 4-second clip (2s pre-impact, 2s post-impact).
* **Automated Pipeline:** Captured videos must be automatically routed to RebootMotion for biomechanical scoring without manual user uploads.

## 4. Gamification & Retention Rules
The system must track and display the following for player engagement:
* **XP Rewards:** 50 XP for a session, 100 XP for a PR, and 150-1000 XP for various streaks.
* **Player Levels:** Progression from Level 1 (Rookie) to Level 10 (Barrel King).
* **Retention Triggers:** Use intelligent prompts to upgrade users to video tiers if their "Kinetic Fingerprint" shows inconsistency that requires mechanical review.

## 5. Scoring & Data Normalization
* **Scoring Scale:** All internal metrics must be converted to the MLB 20-80 Scouting Scale.
* **Age Normalization:** Performance scores must be capped/adjusted based on age groups (10U to Pro).
* **Leak Detection:** Use "Coach Rick's voice" to identify energy leaks like "LATE_LEGS" or "EARLY_ARMS" based on kinetic chain timing.
