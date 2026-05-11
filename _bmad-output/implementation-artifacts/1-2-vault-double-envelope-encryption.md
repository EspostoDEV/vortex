# Story 1.2: Vault & Double-Envelope Encryption

Status: done

## Story

As a Developer,
I want a secure encryption layer (Vault) for provider keys,
So that I can prevent key leakage even if the database is compromised.

## Acceptance Criteria

1. **Master Key Configuration:** A secondary `VORTEX_MASTER_KEY` must be defined in `.env` and accessible via config.
2. **Double-Envelope Logic:** Encryption must combine Laravel's `APP_KEY` with the `VORTEX_MASTER_KEY` using AES-256-GCM.
3. **Core Vault Service:** A framework-agnostic service in `app/Core/Vault` to handle encryption/decryption.
4. **Eloquent Integration:** Encrypted values must be stored using Laravel's `Encrypted Casts` (or a custom cast if needed for double-envelope).
5. **Log Masking:** All sensitive keys/tokens must be masked in traces/logs using the `#[SensitiveParameter]` attribute.
6. **Provider Model Foundation:** Create a `Provider` model with encrypted fields for `credentials`.

## Tasks

- [x] Add `VORTEX_MASTER_KEY` to `.env.example` and documentation.
- [x] Create `App\Core\Vault\Contracts\VaultInterface.php`.
- [x] Implement `App\Core\Vault\DoubleEnvelopeVault.php` using AES-256-GCM.
- [x] Create a custom Eloquent Cast `App\Core\Vault\Casts\DoubleEnvelopeCast.php` to automate model encryption.
- [x] Create `database/migrations/2026_05_11_000001_create_providers_table.php`.
- [x] Create `App\Models\Provider.php` with the custom cast.
- [x] Implement unit tests in `tests/Backend/Unit/Core/Vault/DoubleEnvelopeVaultTest.php`.
- [x] Implement feature tests in `tests/Backend/Feature/ProviderEncryptionTest.php`.

## Developer Context

### Intent
Establish the security baseline for the entire application. Every external connection (Proxmox, Docker) will rely on this Vault to store sensitive tokens. We use Double-Envelope encryption to ensure that a leak of the database AND the `APP_KEY` is still protected by the `VORTEX_MASTER_KEY` (which should ideally be stored in a separate secret manager or provided at runtime).

### Architecture Compliance
- **Location:** Encryption logic MUST live in `app/Core/Vault` to remain agnositc.
- **Pattern:** Strategy Pattern via `VaultInterface`.
- **Naming:** `snake_case` for database columns (`encrypted_token`).
- **PHP 8.2+:** Use `#[SensitiveParameter]` in all service methods receiving keys.

### Technical Notes
- Laravel's `Encrypted` cast uses `APP_KEY` by default. To support the second key, a custom Cast is necessary.
- Use `openssl_encrypt` and `openssl_decrypt` with `aes-256-gcm` tag for the implementation.
- Ensure the `VORTEX_MASTER_KEY` is base64 encoded in `.env`.

### References
- `architecture.md#3.2 Security & Secrets`
- `prd.md#8.2 Segurança e Resiliência`
- `epics.md#Story 1.2`
