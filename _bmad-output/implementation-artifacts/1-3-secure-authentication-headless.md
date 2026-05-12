# Story 1.3: Secure Authentication (Headless)

Status: done

## Story

As an Admin,
I want to authenticate via Laravel Fortify and setup 2FA,
So that I can ensure only authorized users access the Control Plane.

## Acceptance Criteria

1. **Headless Authentication:** Login flow must be handled by Fortify but rendered via Inertia.js.
2. **Ebony Login Page:** Create a premium dark-themed login page at `Auth/Login.jsx`.
3. **Two-Factor Authentication:** Users must be able to enable 2FA and verify it using a TOTP app (Google Authenticator, etc.).
4. **Session Security:** Enforce a 1-hour session duration as per NFR6.
5. **Redirect Logic:** Post-login redirection should point to the dashboard.
6. **2FA Challenge Page:** Create a 2FA challenge page for users with 2FA enabled.

## Tasks

- [x] Configure `config/session.php` for 1-hour lifetime.
- [x] Implement `FortifyServiceProvider` views for login and two-factor challenge.
- [x] Create `resources/js/Pages/Auth/Login.jsx` with Ebony design tokens.
- [x] Create `resources/js/Pages/Auth/TwoFactorChallenge.jsx`.
- [x] Create `resources/js/Pages/Profile/TwoFactorAuthenticationForm.jsx` (to enable 2FA).
- [x] Update `Dashboard.jsx` to show 2FA status and enable button.
- [x] Implement feature tests for login and 2FA flow in `tests/Backend/Feature/AuthenticationTest.php`.

## Developer Context

### Intent
Secure the access to the Vortex Control Plane. Since we are managing infrastructure, security is paramount. We use Fortify in headless mode to keep the backend logic robust while having full control over the UI with React/Inertia.

### Architecture Compliance
- **Framework:** Laravel Fortify (Headless).
- **Frontend:** Inertia.js + React.
- **Styling:** Vanilla CSS (Ebony theme).
- **Naming:** `snake_case`.

### Technical Notes
- Fortify expects view closures in the `boot` method of `FortifyServiceProvider`.
- Use `Inertia::render()` inside these closures.
- Ensure `session.lifetime` is set to 60.
- For 2FA, ensure the `two-factor-authentication` feature is enabled in `config/fortify.php`.

### References
- `architecture.md#5.3 Auth`
- `prd.md#8.2 Segurança e Resiliência`
- `epics.md#Story 1.3`
