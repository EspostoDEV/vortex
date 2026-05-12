---
title: Fix Provider Encryption Test
type: bugfix
created: '2026-05-12'
status: in-review
baseline_commit: '41d7c57'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The `ProviderEncryptionTest` fails with a `SQLSTATE[23000]` error because it omits the required `url` field when creating a `Provider` model and uses an outdated `credentials` field that doesn't exist in the current database schema.

**Approach:** Update the test to use the correct fields (`url`, `token_id`, `token_secret`) as defined in the `Provider` model and migration, ensuring the `DoubleEnvelopeVault` encryption/decryption logic is correctly verified through full database round-trips and exact key isolation checks.

## Boundaries & Constraints

**Always:** Use the `DoubleEnvelopeVault` for any sensitive data encryption. Maintain PSR-12 coding standards. Ensure master keys are exactly 32 bytes (256 bits).

**Ask First:** If the `Provider` model needs structural changes beyond the current fix.

**Never:** Modify the `Provider` model or migration unless absolutely necessary for the test fix. Do not disable database constraints in tests.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Encryption Verification | `token_secret` provided during creation | Database stores encrypted value; model retrieves decrypted value | N/A |
| Config Override | Custom 32-byte key in config | Encryption/decryption uses the custom key correctly (verified via re-fetch) | N/A |
| Key Mismatch | Key changed after encryption | Decryption fails when re-fetching from database | Exception thrown |

</frozen-after-approval>

## Code Map

- `app/Models/Provider.php` -- The model being tested, contains `$fillable` and `DoubleEnvelopeCast`.
- `tests/Backend/Feature/ProviderEncryptionTest.php` -- The failing test file that needs alignment.
- `database/migrations/2026_05_11_203200_create_providers_table.php` -- Schema reference for `providers` table.

## Tasks & Acceptance

**Execution:**
- [x] `tests/Backend/Feature/ProviderEncryptionTest.php` -- Align fields, implement full DB round-trips, and add key isolation test with exact 32-byte keys -- Ensures robust encryption verification.

**Acceptance Criteria:**
- Given a `Provider` model with a `token_secret`, when saved, then the database record should contain an encrypted string (verified via `DB::table()`).
- Given an encrypted `Provider` in the database, when retrieved via `Provider::find()`, then the `token_secret` should be decrypted to its original value.
- Given a custom 32-byte master key in config, when a `Provider` is created and then re-fetched via `Provider::find()`, then the `token_secret` must match the original value.
- Given a `Provider` encrypted with Key A (32 bytes), when the config is changed to Key B (32 bytes), then retrieving the `Provider` must throw a decryption exception.

## Spec Change Log

- **Findings (Loop 1):** Auditor identified Test 2 (Config Override) as weak due to lack of DB round-trip.
- **Findings (Loop 2):** Auditor identified lack of key isolation verification (negative test) and suggested defensive assertions.
- **Findings (Loop 3):** Auditor identified off-by-one error in key length (33 vs 32 bytes) and hardcoded exception messages.
- **Amended:** Updated ACs to require 32-byte keys, explicit DB round-trip, and key isolation checks. Updated tasks to include negative test case and defensive assertions.
- **Avoids:** Driver-level key length errors masking encryption logic failures.
- **KEEP:** Basic field alignment and use of RefreshDatabase.

## Verification

**Commands:**
- `php artisan test --filter ProviderEncryptionTest` -- expected: PASS
