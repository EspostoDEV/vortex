---
title: Provider Validation & Handshake
type: feature
created: 2026-05-11
status: done
baseline_commit: '2ba37849c28c46d1b3869764eb465164aa26eb0e'
context: []
---

# Story 1.5: Provider Validation & Handshake

## Story

As an Admin,
I want to test my Proxmox/Docker connections before saving them,
So that I can ensure the keys are working as expected.

## Acceptance Criteria

1. **Provider Contract:** Define a `ProviderInterface` in `app/Core/Contracts` with a `validate()` method.
2. **Driver Implementation:** Implement a basic `ProxmoxDriver` and `DockerDriver` in `app/Core/Drivers` that performs a real HTTP handshake with the remote API.
3. **Handshake Logic:** The `validate()` method must return a `Result` object (success/failure) with clear technical error messages.
4. **Wizard Integration:** Update the `/wizard` (Step 3) to call the backend validation endpoint and display the real result.
5. **Secure Persistence:** Successful validation must allow saving the provider details to the database, with secrets encrypted via `DoubleEnvelopeVault`.
6. **Masking:** Sensitive keys must be masked in any error logs generated during the handshake.

## Tasks

- [x] Create `app/Core/Contracts/ProviderInterface.php`.
- [x] Create `app/Core/Drivers/ProxmoxDriver.php` (using `Http` client to check `/api2/json/version` or similar).
- [x] Create `app/Core/Drivers/DockerDriver.php` (using `Http` client to check `/version` or similar).
- [x] Implement `POST /api/wizard/validate` endpoint in `WizardController`.
- [x] Implement `POST /api/wizard/save` endpoint to persist the connection.
- [x] Update `ValidationHandshake.jsx` to call these real endpoints.
- [x] Add unit tests for Drivers using `Http::fake()`.

## Developer Context

### Intent
Moving from simulation to reality. This story builds the bridge between the Vortex Control Plane and the physical/virtual lab. Reliability is the focus here.

### Architecture Compliance
- **Core Isolation:** Drivers must be in `app/Core/Drivers` and not depend on Laravel's Eloquent directly (prefer DTOs or simple arrays for config).
- **Security:** Use the `DoubleEnvelopeVault` created in Story 1.2 to encrypt `token_secret` before saving.
- **HTTP Client:** Use Laravel's `Http` facade for clean, testable handshakes.

### Technical Notes
- For Proxmox, a simple GET to `/api2/json/version` or a POST to access tokens is enough to verify connectivity.
- For Docker, checking the `/version` or `/info` endpoint is the standard handshake.
- Ensure the `WizardController` handles potential exceptions (timeouts, DNS failures) and returns them as user-friendly strings.

### References
- `architecture.md#3.3 Domain & Communication Patterns`
- `epics.md#Story 1.5`
- `1-2-vault-double-envelope-encryption.md`
