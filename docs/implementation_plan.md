# Migration & Scoring Update Plan

## Goal Description
Implement the new "Kinetic Fingerprint" data model and scoring logic to support the product's next evolution. This involves adding `players` and `sensor_swings` tables and updating the scoring engine to use the "Freeman Efficiency Ratio" and new 4B framework metrics.

## User Review Required
> [!IMPORTANT]
> This migration introduces new core tables (`players`, `sensor_swings`) which may require backfilling data for existing users.
> The scoring logic update is a fundamental change. Existing scores might need recalculation or versioning.

## Proposed Changes

### Database Schema
#### [MODIFY] [schema.prisma](file:///Users/rickstrickland/Desktop/BarrelsMainmlk/prisma/schema.prisma)
- Add `model Player` to store profile data (`motor_profile`, `membership_tier`, `sensor_serial`, `xp`, `level`).
- Add `model SensorSwing` to store raw sensor and biomechanics data (`dk_swing_uuid`, `reboot_job_id`, specialized metrics).
- usage of `DirectUrl` for migration compatibility.

### Scoring Logic
#### [MODIFY] [scoreCalculations.ts](file:///Users/rickstrickland/Desktop/BarrelsMainmlk/lib/scoreCalculations.ts)
- Implement `calculateKineticChainEfficiency` (Bat KE / Legs KE).
- Implement `calculateB1Score` (Rotational Foundation).
- Implement `calculateMechanicalLoss` (Expected vs Actual Bat Speed).
- Implement `calculateContactQuality` (Sweet Spot + Hard Hit bonuses).
- Update overall scoring to aggregate these new metrics.

## Verification Plan

### Automated Tests
- Create a new test file `tests/scoring-v2.test.ts` to unit test the new scoring functions with sample data (e.g., "Freeman Standard" inputs).
- Run `npx prisma validate` to ensure schema correctness.

### Manual Verification
- Generate a migration SQL file using `npx prisma migrate dev --create-only`.
- Review the generated SQL against the product rules.
