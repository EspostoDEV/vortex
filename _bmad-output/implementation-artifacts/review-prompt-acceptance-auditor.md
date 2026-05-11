# Audit Prompt: Acceptance Auditor

Role: You are a Product Owner/QA Auditor.
Task: Review the provided diff against the Story Specification (Story 1.1).
Constraint: Identify AC violations, deviations from intent, and missing implementations.

## Story Specification

# Story 1.1: Project Bootstrap & Environment Setup

Status: review

## Story

As a Developer,
I want a clean Laravel 11 setup with Inertia, React, and Taskfile automation,
so that I have a solid, manual foundation without opinionated kit bloat.

## Acceptance Criteria

1. Laravel 11 installed via `composer create-project`. [Architecture: 2.2]
2. Inertia.js (Server & Client) configured for React 18. [Architecture: 5.1]
3. Laravel Fortify installed and configured in headless mode.
4. `Taskfile.yaml` exists with `setup`, `dev`, and `test` commands. [Architecture: 2.2]
5. Project structure follows the defined tree:
    - `app/Core` (Domain Logic)
    - `tests/Backend` (Pest)
    - `tests/Frontend` (Vitest)
6. Styling uses Vanilla CSS (Initial reset/base styles included). [Architecture: 5.3]

## Tasks / Subtasks

- [x] Initialize Laravel 11 project
- [x] Install and configure Inertia.js (Middleware, app.blade.php)
- [x] Install React 18 and `@inertiajs/react` dependencies
- [x] Configure Vite for React (`vite.config.js`)
- [x] Install and publish Laravel Fortify in headless mode
- [x] Create `Taskfile.yaml` with `setup`, `dev`, and `test` commands
- [x] Create required directory structure (app/Core, tests/*)
- [x] Setup initial CSS reset and Ebony design tokens in `resources/css/app.css`

## Dev Notes

- **Manual Install Only:** DO NOT use Laravel Breeze, Jetstream, or any other starter kits.
- **Naming Convention:** Strictly follow `snake_case` for all backend and frontend keys.
- **Styling:** Use Vanilla CSS. Focus on high-contrast dark mode (Ebony) from the start.
- **Taskfile:** The `setup` command should handle `composer install`, `npm install`, and `.env` creation.

### Project Structure Notes

- Alignment with `architecture.md`:
  - Domain logic goes into `app/Core`.
  - Framework logic (Controllers/Middleware) remains in `app/Http`.
  - Persistence remains in `app/Models` but interfaces should be in `app/Core`.

### References

- [Source: architecture.md#2.2 Implementation Standard]
- [Source: architecture.md#5.1 Technology Stack]
- [Source: epics.md#Story 1.1]

## Dev Agent Record

### Agent Model Used

Antigravity v1.0

### Completion Notes List

### File List

- `composer.json` (Modified: Added Inertia, Fortify, Passkeys)
- `package.json` (Modified: Added React, Inertia, Vite plugin)
- `bootstrap/app.php` (Modified: Registered Inertia middleware)
- `bootstrap/providers.php` (Modified: Registered Fortify provider)
- `config/fortify.php` (Created via publish)
- `resources/views/app.blade.php` (Created: Inertia template)
- `resources/js/app.jsx` (Created: React entry point)
- `resources/js/Pages/Dashboard.jsx` (Created: Test page)
- `vite.config.js` (Modified: Configured React)
- `Taskfile.yaml` (Created: Automation)
- `app/Core/` (Created: Domain directory)
- `tests/Backend/` (Created/Reorganized: Feature/Unit tests)
- `resources/css/app.css` (Modified: Reset & Ebony tokens)
- `phpunit.xml` (Modified: Updated test paths)


## Diff to Review

commit f696cc9a2f5055c04a3fb9e48045b0c05a081e43
Author: EternalGerms <matheusesp.profissional@gmail.com>
Date:   Mon May 11 17:06:12 2026 -0300

    chore: initial project bootstrap

diff --git a/Taskfile.yaml b/Taskfile.yaml
new file mode 100644
index 0000000..36db4ba
--- /dev/null
+++ b/Taskfile.yaml
@@ -0,0 +1,44 @@
+version: '3'
+
+tasks:
+  setup:
+    desc: Initial project setup
+    cmds:
+      - composer install
+      - npm install
+      - php artisan key:generate
+      - php artisan migrate
+      - "@php -r \"file_exists('.env') || copy('.env.example', '.env');\""
+
+  dev:
+    desc: Run development servers
+    cmds:
+      - task: dev-backend
+      - task: dev-frontend
+    deps: [dev-backend, dev-frontend]
+
+  dev-backend:
+    desc: Run PHP development server
+    cmds:
+      - php artisan serve
+
+  dev-frontend:
+    desc: Run Vite development server
+    cmds:
+      - npm run dev
+
+  test:
+    desc: Run all tests
+    cmds:
+      - task: test-backend
+      - task: test-frontend
+
+  test-backend:
+    desc: Run Pest tests
+    cmds:
+      - php artisan test
+
+  test-frontend:
+    desc: Run Vitest tests
+    cmds:
+      - npm run test:unit
diff --git a/app/Actions/Fortify/CreateNewUser.php b/app/Actions/Fortify/CreateNewUser.php
new file mode 100644
index 0000000..ee2d712
--- /dev/null
+++ b/app/Actions/Fortify/CreateNewUser.php
@@ -0,0 +1,43 @@
+<?php
+
+namespace App\Actions\Fortify;
+
+use App\Models\User;
+use Illuminate\Support\Facades\Hash;
+use Illuminate\Support\Facades\Validator;
+use Illuminate\Validation\Rule;
+use Illuminate\Validation\ValidationException;
+use Laravel\Fortify\Contracts\CreatesNewUsers;
+
+class CreateNewUser implements CreatesNewUsers
+{
+    use PasswordValidationRules;
+
+    /**
+     * Validate and create a newly registered user.
+     *
+     * @param  array<string, string>  $input
+     *
+     * @throws ValidationException
+     */
+    public function create(array $input): User
+    {
+        Validator::make($input, [
+            'name' => ['required', 'string', 'max:255'],
+            'email' => [
+                'required',
+                'string',
+                'email',
+                'max:255',
+                Rule::unique(User::class),
+            ],
+            'password' => $this->passwordRules(),
+        ])->validate();
+
+        return User::create([
+            'name' => $input['name'],
+            'email' => $input['email'],
+            'password' => Hash::make($input['password']),
+        ]);
+    }
+}
diff --git a/app/Actions/Fortify/PasswordValidationRules.php b/app/Actions/Fortify/PasswordValidationRules.php
new file mode 100644
index 0000000..3678865
--- /dev/null
+++ b/app/Actions/Fortify/PasswordValidationRules.php
@@ -0,0 +1,19 @@
+<?php
+
+namespace App\Actions\Fortify;
+
+use Illuminate\Contracts\Validation\Rule;
+use Illuminate\Validation\Rules\Password;
+
+trait PasswordValidationRules
+{
+    /**
+     * Get the validation rules used to validate passwords.
+     *
+     * @return array<int, Rule|array<mixed>|string>
+     */
+    protected function passwordRules(): array
+    {
+        return ['required', 'string', Password::default(), 'confirmed'];
+    }
+}
diff --git a/app/Actions/Fortify/ResetUserPassword.php b/app/Actions/Fortify/ResetUserPassword.php
new file mode 100644
index 0000000..667651f
--- /dev/null
+++ b/app/Actions/Fortify/ResetUserPassword.php
@@ -0,0 +1,32 @@
+<?php
+
+namespace App\Actions\Fortify;
+
+use App\Models\User;
+use Illuminate\Support\Facades\Hash;
+use Illuminate\Support\Facades\Validator;
+use Illuminate\Validation\ValidationException;
+use Laravel\Fortify\Contracts\ResetsUserPasswords;
+
+class ResetUserPassword implements ResetsUserPasswords
+{
+    use PasswordValidationRules;
+
+    /**
+     * Validate and reset the user's forgotten password.
+     *
+     * @param  array<string, string>  $input
+     *
+     * @throws ValidationException
+     */
+    public function reset(User $user, array $input): void
+    {
+        Validator::make($input, [
+            'password' => $this->passwordRules(),
+        ])->validate();
+
+        $user->forceFill([
+            'password' => Hash::make($input['password']),
+        ])->save();
+    }
+}
diff --git a/app/Actions/Fortify/UpdateUserPassword.php b/app/Actions/Fortify/UpdateUserPassword.php
new file mode 100644
index 0000000..4a0306d
--- /dev/null
+++ b/app/Actions/Fortify/UpdateUserPassword.php
@@ -0,0 +1,35 @@
+<?php
+
+namespace App\Actions\Fortify;
+
+use App\Models\User;
+use Illuminate\Support\Facades\Hash;
+use Illuminate\Support\Facades\Validator;
+use Illuminate\Validation\ValidationException;
+use Laravel\Fortify\Contracts\UpdatesUserPasswords;
+
+class UpdateUserPassword implements UpdatesUserPasswords
+{
+    use PasswordValidationRules;
+
+    /**
+     * Validate and update the user's password.
+     *
+     * @param  array<string, string>  $input
+     *
+     * @throws ValidationException
+     */
+    public function update(User $user, array $input): void
+    {
+        Validator::make($input, [
+            'current_password' => ['required', 'string', 'current_password:web'],
+            'password' => $this->passwordRules(),
+        ], [
+            'current_password.current_password' => __('The provided password does not match your current password.'),
+        ])->validateWithBag('updatePassword');
+
+        $user->forceFill([
+            'password' => Hash::make($input['password']),
+        ])->save();
+    }
+}
diff --git a/app/Actions/Fortify/UpdateUserProfileInformation.php b/app/Actions/Fortify/UpdateUserProfileInformation.php
new file mode 100644
index 0000000..62f58fa
--- /dev/null
+++ b/app/Actions/Fortify/UpdateUserProfileInformation.php
@@ -0,0 +1,61 @@
+<?php
+
+namespace App\Actions\Fortify;
+
+use App\Models\User;
+use Illuminate\Contracts\Auth\MustVerifyEmail;
+use Illuminate\Support\Facades\Validator;
+use Illuminate\Validation\Rule;
+use Illuminate\Validation\ValidationException;
+use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;
+
+class UpdateUserProfileInformation implements UpdatesUserProfileInformation
+{
+    /**
+     * Validate and update the given user's profile information.
+     *
+     * @param  array<string, string>  $input
+     *
+     * @throws ValidationException
+     */
+    public function update(User $user, array $input): void
+    {
+        Validator::make($input, [
+            'name' => ['required', 'string', 'max:255'],
+
+            'email' => [
+                'required',
+                'string',
+                'email',
+                'max:255',
+                Rule::unique('users')->ignore($user->id),
+            ],
+        ])->validateWithBag('updateProfileInformation');
+
+        if ($input['email'] !== $user->email &&
+            $user instanceof MustVerifyEmail) {
+            $this->updateVerifiedUser($user, $input);
+        } else {
+            $user->forceFill([
+                'name' => $input['name'],
+                'email' => $input['email'],
+            ])->save();
+        }
+    }
+
+    /**
+     * Update the given verified user's profile information.
+     *
+     * @param  array<string, string>  $input
+     */
+    protected function updateVerifiedUser(User $user, array $input): void
+    {
+        $user->forceFill([
+            'name' => $input['name'],
+            'email' => $input['email'],
+            'email_verified_at' => null,
+        ])->save();
+
+        $user->sendEmailVerificationNotification();
+    }
+}
diff --git a/app/Http/Controllers/Controller.php b/app/Http/Controllers/Controller.php
new file mode 100644
index 0000000..8677cd5
--- /dev/null
+++ b/app/Http/Controllers/Controller.php
@@ -0,0 +1,8 @@
+<?php
+
+namespace App\Http\Controllers;
+
+abstract class Controller
+{
+    //
+}
diff --git a/app/Http/Middleware/HandleInertiaRequests.php b/app/Http/Middleware/HandleInertiaRequests.php
new file mode 100644
index 0000000..c19ce18
--- /dev/null
+++ b/app/Http/Middleware/HandleInertiaRequests.php
@@ -0,0 +1,43 @@
+<?php
+
+namespace App\Http\Middleware;
+
+use Illuminate\Http\Request;
+use Inertia\Middleware;
+
+class HandleInertiaRequests extends Middleware
+{
+    /**
+     * The root template that's loaded on the first page visit.
+     *
+     * @see https://inertiajs.com/server-side-setup#root-template
+     *
+     * @var string
+     */
+    protected $rootView = 'app';
+
+    /**
+     * Determines the current asset version.
+     *
+     * @see https://inertiajs.com/asset-versioning
+     */
+    public function version(Request $request): ?string
+    {
+        return parent::version($request);
+    }
+
+    /**
+     * Define the props that are shared by default.
+     *
+     * @see https://inertiajs.com/shared-data
+     *
+     * @return array<string, mixed>
+     */
+    public function share(Request $request): array
+    {
+        return [
+            ...parent::share($request),
+            //
+        ];
+    }
+}
diff --git a/app/Models/User.php b/app/Models/User.php
new file mode 100644
index 0000000..def621f
--- /dev/null
+++ b/app/Models/User.php
@@ -0,0 +1,47 @@
+<?php
+
+namespace App\Models;
+
+// use Illuminate\Contracts\Auth\MustVerifyEmail;
+use Illuminate\Database\Eloquent\Factories\HasFactory;
+use Illuminate\Foundation\Auth\User as Authenticatable;
+use Illuminate\Notifications\Notifiable;
+
+class User extends Authenticatable
+{
+    use HasFactory, Notifiable;
+
+    /**
+     * The attributes that are mass assignable.
+     *
+     * @var array<int, string>
+     */
+    protected $fillable = [
+        'name',
+        'email',
+        'password',
+    ];
+
+    /**
+     * The attributes that should be hidden for serialization.
+     *
+     * @var array<int, string>
+     */
+    protected $hidden = [
+        'password',
+        'remember_token',
+    ];
+
+    /**
+     * Get the attributes that should be cast.
+     *
+     * @return array<string, string>
+     */
+    protected function casts(): array
+    {
+        return [
+            'email_verified_at' => 'datetime',
+            'password' => 'hashed',
+        ];
+    }
+}
diff --git a/app/Providers/AppServiceProvider.php b/app/Providers/AppServiceProvider.php
new file mode 100644
index 0000000..452e6b6
--- /dev/null
+++ b/app/Providers/AppServiceProvider.php
@@ -0,0 +1,24 @@
+<?php
+
+namespace App\Providers;
+
+use Illuminate\Support\ServiceProvider;
+
+class AppServiceProvider extends ServiceProvider
+{
+    /**
+     * Register any application services.
+     */
+    public function register(): void
+    {
+        //
+    }
+
+    /**
+     * Bootstrap any application services.
+     */
+    public function boot(): void
+    {
+        //
+    }
+}
diff --git a/app/Providers/FortifyServiceProvider.php b/app/Providers/FortifyServiceProvider.php
new file mode 100644
index 0000000..e48ab1a
--- /dev/null
+++ b/app/Providers/FortifyServiceProvider.php
@@ -0,0 +1,56 @@
+<?php
+
+namespace App\Providers;
+
+use App\Actions\Fortify\CreateNewUser;
+use App\Actions\Fortify\ResetUserPassword;
+use App\Actions\Fortify\UpdateUserPassword;
+use App\Actions\Fortify\UpdateUserProfileInformation;
+use Illuminate\Cache\RateLimiting\Limit;
+use Illuminate\Http\Request;
+use Illuminate\Support\Facades\RateLimiter;
+use Illuminate\Support\ServiceProvider;
+use Illuminate\Support\Str;
+use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
+use Laravel\Fortify\Fortify;
+
+class FortifyServiceProvider extends ServiceProvider
+{
+    /**
+     * Register any application services.
+     */
+    public function register(): void
+    {
+        //
+    }
+
+    /**
+     * Bootstrap any application services.
+     */
+    public function boot(): void
+    {
+        Fortify::createUsersUsing(CreateNewUser::class);
+        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
+        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
+        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
+        Fortify::redirectUserForTwoFactorAuthenticationUsing(RedirectIfTwoFactorAuthenticatable::class);
+
+        RateLimiter::for('login', function (Request $request) {
+            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());
+
+            return Limit::perMinute(5)->by($throttleKey);
+        });
+
+        RateLimiter::for('two-factor', function (Request $request) {
+            return Limit::perMinute(5)->by($request->session()->get('login.id'));
+        });
+
+        RateLimiter::for('passkeys', function (Request $request) {
+            $credentialId = $request->input('credential.id');
+
+            return Limit::perMinute(10)->by(
+                ($credentialId ?: $request->session()->getId()).'|'.$request->ip()
+            );
+        });
+    }
+}
diff --git a/bootstrap/app.php b/bootstrap/app.php
new file mode 100644
index 0000000..58e985f
--- /dev/null
+++ b/bootstrap/app.php
@@ -0,0 +1,20 @@
+<?php
+
+use Illuminate\Foundation\Application;
+use Illuminate\Foundation\Configuration\Exceptions;
+use Illuminate\Foundation\Configuration\Middleware;
+
+return Application::configure(basePath: dirname(__DIR__))
+    ->withRouting(
+        web: __DIR__.'/../routes/web.php',
+        commands: __DIR__.'/../routes/console.php',
+        health: '/up',
+    )
+    ->withMiddleware(function (Middleware $middleware) {
+        $middleware->web(append: [
+            \App\Http\Middleware\HandleInertiaRequests::class,
+        ]);
+    })
+    ->withExceptions(function (Exceptions $exceptions) {
+        //
+    })->create();
diff --git a/bootstrap/cache/.gitignore b/bootstrap/cache/.gitignore
new file mode 100644
index 0000000..d6b7ef3
--- /dev/null
+++ b/bootstrap/cache/.gitignore
@@ -0,0 +1,2 @@
+*
+!.gitignore
diff --git a/bootstrap/providers.php b/bootstrap/providers.php
new file mode 100644
index 0000000..0ad9c57
--- /dev/null
+++ b/bootstrap/providers.php
@@ -0,0 +1,6 @@
+<?php
+
+return [
+    App\Providers\AppServiceProvider::class,
+    App\Providers\FortifyServiceProvider::class,
+];
diff --git a/composer.json b/composer.json
new file mode 100644
index 0000000..de0d088
--- /dev/null
+++ b/composer.json
@@ -0,0 +1,74 @@
+{
+    "name": "laravel/laravel",
+    "type": "project",
+    "description": "The skeleton application for the Laravel framework.",
+    "keywords": ["laravel", "framework"],
+    "license": "MIT",
+    "require": {
+        "php": "^8.2",
+        "inertiajs/inertia-laravel": "^3.1",
+        "laravel/fortify": "^1.36",
+        "laravel/framework": "^11.0",
+        "laravel/passkeys": "^0.1.0",
+        "laravel/tinker": "^2.9"
+    },
+    "require-dev": {
+        "fakerphp/faker": "^1.23",
+        "laravel/pint": "^1.13",
+        "laravel/sail": "^1.26",
+        "mockery/mockery": "^1.6",
+        "nunomaduro/collision": "^8.0",
+        "pestphp/pest": "^2.36",
+        "pestphp/pest-plugin-laravel": "^2.4",
+        "phpunit/phpunit": "^10.5",
+        "spatie/laravel-ignition": "^2.4"
+    },
+    "autoload": {
+        "psr-4": {
+            "App\\": "app/",
+            "Database\\Factories\\": "database/factories/",
+            "Database\\Seeders\\": "database/seeders/"
+        }
+    },
+    "autoload-dev": {
+        "psr-4": {
+            "Tests\\": "tests/"
+        }
+    },
+    "scripts": {
+        "post-autoload-dump": [
+            "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
+            "@php artisan package:discover --ansi"
+        ],
+        "post-update-cmd": [
+            "@php artisan vendor:publish --tag=laravel-assets --ansi --force"
+        ],
+        "post-root-package-install": [
+            "@php -r \"file_exists('.env') || copy('.env.example', '.env');\""
+        ],
+        "post-create-project-cmd": [
+            "@php artisan key:generate --ansi",
+            "@php -r \"file_exists('database/database.sqlite') || touch('database/database.sqlite');\"",
+            "@php artisan migrate --ansi"
+        ]
+    },
+    "extra": {
+        "branch-alias": {
+            "dev-master": "11.x-dev"
+        },
+        "laravel": {
+            "dont-discover": []
+        }
+    },
+    "config": {
+        "optimize-autoloader": true,
+        "preferred-install": "dist",
+        "sort-packages": true,
+        "allow-plugins": {
+            "pestphp/pest-plugin": true,
+            "php-http/discovery": true
+        }
+    },
+    "minimum-stability": "stable",
+    "prefer-stable": true
+}
diff --git a/config/app.php b/config/app.php
new file mode 100644
index 0000000..f467267
--- /dev/null
+++ b/config/app.php
@@ -0,0 +1,126 @@
+<?php
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Application Name
+    |--------------------------------------------------------------------------
+    |
+    | This value is the name of your application, which will be used when the
+    | framework needs to place the application's name in a notification or
+    | other UI elements where an application name needs to be displayed.
+    |
+    */
+
+    'name' => env('APP_NAME', 'Laravel'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Application Environment
+    |--------------------------------------------------------------------------
+    |
+    | This value determines the "environment" your application is currently
+    | running in. This may determine how you prefer to configure various
+    | services the application utilizes. Set this in your ".env" file.
+    |
+    */
+
+    'env' => env('APP_ENV', 'production'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Application Debug Mode
+    |--------------------------------------------------------------------------
+    |
+    | When your application is in debug mode, detailed error messages with
+    | stack traces will be shown on every error that occurs within your
+    | application. If disabled, a simple generic error page is shown.
+    |
+    */
+
+    'debug' => (bool) env('APP_DEBUG', false),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Application URL
+    |--------------------------------------------------------------------------
+    |
+    | This URL is used by the console to properly generate URLs when using
+    | the Artisan command line tool. You should set this to the root of
+    | the application so that it's available within Artisan commands.
+    |
+    */
+
+    'url' => env('APP_URL', 'http://localhost'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Application Timezone
+    |--------------------------------------------------------------------------
+    |
+    | Here you may specify the default timezone for your application, which
+    | will be used by the PHP date and date-time functions. The timezone
+    | is set to "UTC" by default as it is suitable for most use cases.
+    |
+    */
+
+    'timezone' => env('APP_TIMEZONE', 'UTC'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Application Locale Configuration
+    |--------------------------------------------------------------------------
+    |
+    | The application locale determines the default locale that will be used
+    | by Laravel's translation / localization methods. This option can be
+    | set to any locale for which you plan to have translation strings.
+    |
+    */
+
+    'locale' => env('APP_LOCALE', 'en'),
+
+    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),
+
+    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Encryption Key
+    |--------------------------------------------------------------------------
+    |
+    | This key is utilized by Laravel's encryption services and should be set
+    | to a random, 32 character string to ensure that all encrypted values
+    | are secure. You should do this prior to deploying the application.
+    |
+    */
+
+    'cipher' => 'AES-256-CBC',
+
+    'key' => env('APP_KEY'),
+
+    'previous_keys' => [
+        ...array_filter(
+            explode(',', env('APP_PREVIOUS_KEYS', ''))
+        ),
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Maintenance Mode Driver
+    |--------------------------------------------------------------------------
+    |
+    | These configuration options determine the driver used to determine and
+    | manage Laravel's "maintenance mode" status. The "cache" driver will
+    | allow maintenance mode to be controlled across multiple machines.
+    |
+    | Supported drivers: "file", "cache"
+    |
+    */
+
+    'maintenance' => [
+        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
+        'store' => env('APP_MAINTENANCE_STORE', 'database'),
+    ],
+
+];
diff --git a/config/auth.php b/config/auth.php
new file mode 100644
index 0000000..0ba5d5d
--- /dev/null
+++ b/config/auth.php
@@ -0,0 +1,115 @@
+<?php
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Authentication Defaults
+    |--------------------------------------------------------------------------
+    |
+    | This option defines the default authentication "guard" and password
+    | reset "broker" for your application. You may change these values
+    | as required, but they're a perfect start for most applications.
+    |
+    */
+
+    'defaults' => [
+        'guard' => env('AUTH_GUARD', 'web'),
+        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Authentication Guards
+    |--------------------------------------------------------------------------
+    |
+    | Next, you may define every authentication guard for your application.
+    | Of course, a great default configuration has been defined for you
+    | which utilizes session storage plus the Eloquent user provider.
+    |
+    | All authentication guards have a user provider, which defines how the
+    | users are actually retrieved out of your database or other storage
+    | system used by the application. Typically, Eloquent is utilized.
+    |
+    | Supported: "session"
+    |
+    */
+
+    'guards' => [
+        'web' => [
+            'driver' => 'session',
+            'provider' => 'users',
+        ],
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | User Providers
+    |--------------------------------------------------------------------------
+    |
+    | All authentication guards have a user provider, which defines how the
+    | users are actually retrieved out of your database or other storage
+    | system used by the application. Typically, Eloquent is utilized.
+    |
+    | If you have multiple user tables or models you may configure multiple
+    | providers to represent the model / table. These providers may then
+    | be assigned to any extra authentication guards you have defined.
+    |
+    | Supported: "database", "eloquent"
+    |
+    */
+
+    'providers' => [
+        'users' => [
+            'driver' => 'eloquent',
+            'model' => env('AUTH_MODEL', App\Models\User::class),
+        ],
+
+        // 'users' => [
+        //     'driver' => 'database',
+        //     'table' => 'users',
+        // ],
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Resetting Passwords
+    |--------------------------------------------------------------------------
+    |
+    | These configuration options specify the behavior of Laravel's password
+    | reset functionality, including the table utilized for token storage
+    | and the user provider that is invoked to actually retrieve users.
+    |
+    | The expiry time is the number of minutes that each reset token will be
+    | considered valid. This security feature keeps tokens short-lived so
+    | they have less time to be guessed. You may change this as needed.
+    |
+    | The throttle setting is the number of seconds a user must wait before
+    | generating more password reset tokens. This prevents the user from
+    | quickly generating a very large amount of password reset tokens.
+    |
+    */
+
+    'passwords' => [
+        'users' => [
+            'provider' => 'users',
+            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
+            'expire' => 60,
+            'throttle' => 60,
+        ],
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Password Confirmation Timeout
+    |--------------------------------------------------------------------------
+    |
+    | Here you may define the amount of seconds before a password confirmation
+    | window expires and users are asked to re-enter their password via the
+    | confirmation screen. By default, the timeout lasts for three hours.
+    |
+    */
+
+    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),
+
+];
diff --git a/config/cache.php b/config/cache.php
new file mode 100644
index 0000000..3eb95d1
--- /dev/null
+++ b/config/cache.php
@@ -0,0 +1,107 @@
+<?php
+
+use Illuminate\Support\Str;
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Default Cache Store
+    |--------------------------------------------------------------------------
+    |
+    | This option controls the default cache store that will be used by the
+    | framework. This connection is utilized if another isn't explicitly
+    | specified when running a cache operation inside the application.
+    |
+    */
+
+    'default' => env('CACHE_STORE', 'database'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Cache Stores
+    |--------------------------------------------------------------------------
+    |
+    | Here you may define all of the cache "stores" for your application as
+    | well as their drivers. You may even define multiple stores for the
+    | same cache driver to group types of items stored in your caches.
+    |
+    | Supported drivers: "apc", "array", "database", "file", "memcached",
+    |                    "redis", "dynamodb", "octane", "null"
+    |
+    */
+
+    'stores' => [
+
+        'array' => [
+            'driver' => 'array',
+            'serialize' => false,
+        ],
+
+        'database' => [
+            'driver' => 'database',
+            'table' => env('DB_CACHE_TABLE', 'cache'),
+            'connection' => env('DB_CACHE_CONNECTION', null),
+            'lock_connection' => env('DB_CACHE_LOCK_CONNECTION', null),
+        ],
+
+        'file' => [
+            'driver' => 'file',
+            'path' => storage_path('framework/cache/data'),
+            'lock_path' => storage_path('framework/cache/data'),
+        ],
+
+        'memcached' => [
+            'driver' => 'memcached',
+            'persistent_id' => env('MEMCACHED_PERSISTENT_ID'),
+            'sasl' => [
+                env('MEMCACHED_USERNAME'),
+                env('MEMCACHED_PASSWORD'),
+            ],
+            'options' => [
+                // Memcached::OPT_CONNECT_TIMEOUT => 2000,
+            ],
+            'servers' => [
+                [
+                    'host' => env('MEMCACHED_HOST', '127.0.0.1'),
+                    'port' => env('MEMCACHED_PORT', 11211),
+                    'weight' => 100,
+                ],
+            ],
+        ],
+
+        'redis' => [
+            'driver' => 'redis',
+            'connection' => env('REDIS_CACHE_CONNECTION', 'cache'),
+            'lock_connection' => env('REDIS_CACHE_LOCK_CONNECTION', 'default'),
+        ],
+
+        'dynamodb' => [
+            'driver' => 'dynamodb',
+            'key' => env('AWS_ACCESS_KEY_ID'),
+            'secret' => env('AWS_SECRET_ACCESS_KEY'),
+            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
+            'table' => env('DYNAMODB_CACHE_TABLE', 'cache'),
+            'endpoint' => env('DYNAMODB_ENDPOINT'),
+        ],
+
+        'octane' => [
+            'driver' => 'octane',
+        ],
+
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Cache Key Prefix
+    |--------------------------------------------------------------------------
+    |
+    | When utilizing the APC, database, memcached, Redis, and DynamoDB cache
+    | stores, there might be other applications using the same cache. For
+    | that reason, you may prefix every cache key to avoid collisions.
+    |
+    */
+
+    'prefix' => env('CACHE_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_cache_'),
+
+];
diff --git a/config/database.php b/config/database.php
new file mode 100644
index 0000000..3ddc396
--- /dev/null
+++ b/config/database.php
@@ -0,0 +1,170 @@
+<?php
+
+use Illuminate\Support\Str;
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Default Database Connection Name
+    |--------------------------------------------------------------------------
+    |
+    | Here you may specify which of the database connections below you wish
+    | to use as your default connection for database operations. This is
+    | the connection which will be utilized unless another connection
+    | is explicitly specified when you execute a query / statement.
+    |
+    */
+
+    'default' => env('DB_CONNECTION', 'sqlite'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Database Connections
+    |--------------------------------------------------------------------------
+    |
+    | Below are all of the database connections defined for your application.
+    | An example configuration is provided for each database system which
+    | is supported by Laravel. You're free to add / remove connections.
+    |
+    */
+
+    'connections' => [
+
+        'sqlite' => [
+            'driver' => 'sqlite',
+            'url' => env('DB_URL'),
+            'database' => env('DB_DATABASE', database_path('database.sqlite')),
+            'prefix' => '',
+            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
+        ],
+
+        'mysql' => [
+            'driver' => 'mysql',
+            'url' => env('DB_URL'),
+            'host' => env('DB_HOST', '127.0.0.1'),
+            'port' => env('DB_PORT', '3306'),
+            'database' => env('DB_DATABASE', 'laravel'),
+            'username' => env('DB_USERNAME', 'root'),
+            'password' => env('DB_PASSWORD', ''),
+            'unix_socket' => env('DB_SOCKET', ''),
+            'charset' => env('DB_CHARSET', 'utf8mb4'),
+            'collation' => env('DB_COLLATION', 'utf8mb4_0900_ai_ci'),
+            'prefix' => '',
+            'prefix_indexes' => true,
+            'strict' => true,
+            'engine' => null,
+            'options' => extension_loaded('pdo_mysql') ? array_filter([
+                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
+            ]) : [],
+        ],
+
+        'mariadb' => [
+            'driver' => 'mariadb',
+            'url' => env('DB_URL'),
+            'host' => env('DB_HOST', '127.0.0.1'),
+            'port' => env('DB_PORT', '3306'),
+            'database' => env('DB_DATABASE', 'laravel'),
+            'username' => env('DB_USERNAME', 'root'),
+            'password' => env('DB_PASSWORD', ''),
+            'unix_socket' => env('DB_SOCKET', ''),
+            'charset' => env('DB_CHARSET', 'utf8mb4'),
+            'collation' => env('DB_COLLATION', 'utf8mb4_uca1400_ai_ci'),
+            'prefix' => '',
+            'prefix_indexes' => true,
+            'strict' => true,
+            'engine' => null,
+            'options' => extension_loaded('pdo_mysql') ? array_filter([
+                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
+            ]) : [],
+        ],
+
+        'pgsql' => [
+            'driver' => 'pgsql',
+            'url' => env('DB_URL'),
+            'host' => env('DB_HOST', '127.0.0.1'),
+            'port' => env('DB_PORT', '5432'),
+            'database' => env('DB_DATABASE', 'laravel'),
+            'username' => env('DB_USERNAME', 'root'),
+            'password' => env('DB_PASSWORD', ''),
+            'charset' => env('DB_CHARSET', 'utf8'),
+            'prefix' => '',
+            'prefix_indexes' => true,
+            'search_path' => 'public',
+            'sslmode' => 'prefer',
+        ],
+
+        'sqlsrv' => [
+            'driver' => 'sqlsrv',
+            'url' => env('DB_URL'),
+            'host' => env('DB_HOST', 'localhost'),
+            'port' => env('DB_PORT', '1433'),
+            'database' => env('DB_DATABASE', 'laravel'),
+            'username' => env('DB_USERNAME', 'root'),
+            'password' => env('DB_PASSWORD', ''),
+            'charset' => env('DB_CHARSET', 'utf8'),
+            'prefix' => '',
+            'prefix_indexes' => true,
+            // 'encrypt' => env('DB_ENCRYPT', 'yes'),
+            // 'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'false'),
+        ],
+
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Migration Repository Table
+    |--------------------------------------------------------------------------
+    |
+    | This table keeps track of all the migrations that have already run for
+    | your application. Using this information, we can determine which of
+    | the migrations on disk haven't actually been run on the database.
+    |
+    */
+
+    'migrations' => [
+        'table' => 'migrations',
+        'update_date_on_publish' => true,
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Redis Databases
+    |--------------------------------------------------------------------------
+    |
+    | Redis is an open source, fast, and advanced key-value store that also
+    | provides a richer body of commands than a typical key-value system
+    | such as Memcached. You may define your connection settings here.
+    |
+    */
+
+    'redis' => [
+
+        'client' => env('REDIS_CLIENT', 'phpredis'),
+
+        'options' => [
+            'cluster' => env('REDIS_CLUSTER', 'redis'),
+            'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
+        ],
+
+        'default' => [
+            'url' => env('REDIS_URL'),
+            'host' => env('REDIS_HOST', '127.0.0.1'),
+            'username' => env('REDIS_USERNAME'),
+            'password' => env('REDIS_PASSWORD'),
+            'port' => env('REDIS_PORT', '6379'),
+            'database' => env('REDIS_DB', '0'),
+        ],
+
+        'cache' => [
+            'url' => env('REDIS_URL'),
+            'host' => env('REDIS_HOST', '127.0.0.1'),
+            'username' => env('REDIS_USERNAME'),
+            'password' => env('REDIS_PASSWORD'),
+            'port' => env('REDIS_PORT', '6379'),
+            'database' => env('REDIS_CACHE_DB', '1'),
+        ],
+
+    ],
+
+];
diff --git a/config/filesystems.php b/config/filesystems.php
new file mode 100644
index 0000000..44fe9c8
--- /dev/null
+++ b/config/filesystems.php
@@ -0,0 +1,76 @@
+<?php
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Default Filesystem Disk
+    |--------------------------------------------------------------------------
+    |
+    | Here you may specify the default filesystem disk that should be used
+    | by the framework. The "local" disk, as well as a variety of cloud
+    | based disks are available to your application for file storage.
+    |
+    */
+
+    'default' => env('FILESYSTEM_DISK', 'local'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Filesystem Disks
+    |--------------------------------------------------------------------------
+    |
+    | Below you may configure as many filesystem disks as necessary, and you
+    | may even configure multiple disks for the same driver. Examples for
+    | most supported storage drivers are configured here for reference.
+    |
+    | Supported Drivers: "local", "ftp", "sftp", "s3"
+    |
+    */
+
+    'disks' => [
+
+        'local' => [
+            'driver' => 'local',
+            'root' => storage_path('app'),
+            'throw' => false,
+        ],
+
+        'public' => [
+            'driver' => 'local',
+            'root' => storage_path('app/public'),
+            'url' => env('APP_URL').'/storage',
+            'visibility' => 'public',
+            'throw' => false,
+        ],
+
+        's3' => [
+            'driver' => 's3',
+            'key' => env('AWS_ACCESS_KEY_ID'),
+            'secret' => env('AWS_SECRET_ACCESS_KEY'),
+            'region' => env('AWS_DEFAULT_REGION'),
+            'bucket' => env('AWS_BUCKET'),
+            'url' => env('AWS_URL'),
+            'endpoint' => env('AWS_ENDPOINT'),
+            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
+            'throw' => false,
+        ],
+
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Symbolic Links
+    |--------------------------------------------------------------------------
+    |
+    | Here you may configure the symbolic links that will be created when the
+    | `storage:link` Artisan command is executed. The array keys should be
+    | the locations of the links and the values should be their targets.
+    |
+    */
+
+    'links' => [
+        public_path('storage') => storage_path('app/public'),
+    ],
+
+];
diff --git a/config/fortify.php b/config/fortify.php
new file mode 100644
index 0000000..3c76c68
--- /dev/null
+++ b/config/fortify.php
@@ -0,0 +1,180 @@
+<?php
+
+use Laravel\Fortify\Features;
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Fortify Guard
+    |--------------------------------------------------------------------------
+    |
+    | Here you may specify which authentication guard Fortify will use while
+    | authenticating users. This value should correspond with one of your
+    | guards that is already present in your "auth" configuration file.
+    |
+    */
+
+    'guard' => 'web',
+
+    /*
+    |--------------------------------------------------------------------------
+    | Fortify Password Broker
+    |--------------------------------------------------------------------------
+    |
+    | Here you may specify which password broker Fortify can use when a user
+    | is resetting their password. This configured value should match one
+    | of your password brokers setup in your "auth" configuration file.
+    |
+    */
+
+    'passwords' => 'users',
+
+    /*
+    |--------------------------------------------------------------------------
+    | Username / Email
+    |--------------------------------------------------------------------------
+    |
+    | This value defines which model attribute should be considered as your
+    | application's "username" field. Typically, this might be the email
+    | address of the users but you are free to change this value here.
+    |
+    | Out of the box, Fortify expects forgot password and reset password
+    | requests to have a field named 'email'. If the application uses
+    | another name for the field you may define it below as needed.
+    |
+    */
+
+    'username' => 'email',
+
+    'email' => 'email',
+
+    /*
+    |--------------------------------------------------------------------------
+    | Lowercase Usernames
+    |--------------------------------------------------------------------------
+    |
+    | This value defines whether usernames should be lowercased before saving
+    | them in the database, as some database system string fields are case
+    | sensitive. You may disable this for your application if necessary.
+    |
+    */
+
+    'lowercase_usernames' => true,
+
+    /*
+    |--------------------------------------------------------------------------
+    | Home Path
+    |--------------------------------------------------------------------------
+    |
+    | Here you may configure the path where users will get redirected during
+    | authentication or password reset when the operations are successful
+    | and the user is authenticated. You are free to change this value.
+    |
+    */
+
+    'home' => '/home',
+
+    /*
+    |--------------------------------------------------------------------------
+    | Fortify Routes Prefix / Subdomain
+    |--------------------------------------------------------------------------
+    |
+    | Here you may specify which prefix Fortify will assign to all the routes
+    | that it registers with the application. If necessary, you may change
+    | subdomain under which all of the Fortify routes will be available.
+    |
+    */
+
+    'prefix' => '',
+
+    'domain' => null,
+
+    /*
+    |--------------------------------------------------------------------------
+    | Fortify Routes Middleware
+    |--------------------------------------------------------------------------
+    |
+    | Here you may specify which middleware Fortify will assign to the routes
+    | that it registers with the application. If necessary, you may change
+    | these middleware but typically this provided default is preferred.
+    |
+    */
+
+    'middleware' => ['web'],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Rate Limiting
+    |--------------------------------------------------------------------------
+    |
+    | By default, Fortify will throttle logins to five requests per minute for
+    | every email and IP address combination. However, if you would like to
+    | specify a custom rate limiter to call then you may specify it here.
+    |
+    */
+
+    'limiters' => [
+        'login' => 'login',
+        'two-factor' => 'two-factor',
+        'passkeys' => 'passkeys',
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Register View Routes
+    |--------------------------------------------------------------------------
+    |
+    | Here you may specify if the routes returning views should be disabled as
+    | you may not need them when building your own application. This may be
+    | especially true if you're writing a custom single-page application.
+    |
+    */
+
+    'views' => true,
+
+    /*
+    |--------------------------------------------------------------------------
+    | Passkeys
+    |--------------------------------------------------------------------------
+    |
+    | These settings configure Fortify's passkey (WebAuthn) support. Passkeys
+    | allow users to sign in without needing to remember credentials since
+    | they use public-key cryptography - making them immune to breaches.
+    |
+    */
+
+    'passkeys' => [
+        'relying_party_id' => parse_url(config('app.url'), PHP_URL_HOST),
+        'allowed_origins' => [config('app.url')],
+        'timeout' => 60000,
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Features
+    |--------------------------------------------------------------------------
+    |
+    | Some of the Fortify features are optional. You may disable the features
+    | by removing them from this array. You're free to only remove some of
+    | these features or you can even remove all of these if you need to.
+    |
+    */
+
+    'features' => [
+        Features::registration(),
+        Features::resetPasswords(),
+        // Features::emailVerification(),
+        Features::updateProfileInformation(),
+        Features::updatePasswords(),
+        Features::twoFactorAuthentication([
+            'confirm' => true,
+            'confirmPassword' => true,
+            // 'window' => 0,
+        ]),
+        Features::passkeys([
+            'confirmPassword' => true,
+        ]),
+    ],
+
+];
diff --git a/config/logging.php b/config/logging.php
new file mode 100644
index 0000000..d526b64
--- /dev/null
+++ b/config/logging.php
@@ -0,0 +1,132 @@
+<?php
+
+use Monolog\Handler\NullHandler;
+use Monolog\Handler\StreamHandler;
+use Monolog\Handler\SyslogUdpHandler;
+use Monolog\Processor\PsrLogMessageProcessor;
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Default Log Channel
+    |--------------------------------------------------------------------------
+    |
+    | This option defines the default log channel that is utilized to write
+    | messages to your logs. The value provided here should match one of
+    | the channels present in the list of "channels" configured below.
+    |
+    */
+
+    'default' => env('LOG_CHANNEL', 'stack'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Deprecations Log Channel
+    |--------------------------------------------------------------------------
+    |
+    | This option controls the log channel that should be used to log warnings
+    | regarding deprecated PHP and library features. This allows you to get
+    | your application ready for upcoming major versions of dependencies.
+    |
+    */
+
+    'deprecations' => [
+        'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
+        'trace' => env('LOG_DEPRECATIONS_TRACE', false),
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Log Channels
+    |--------------------------------------------------------------------------
+    |
+    | Here you may configure the log channels for your application. Laravel
+    | utilizes the Monolog PHP logging library, which includes a variety
+    | of powerful log handlers and formatters that you're free to use.
+    |
+    | Available Drivers: "single", "daily", "slack", "syslog",
+    |                    "errorlog", "monolog", "custom", "stack"
+    |
+    */
+
+    'channels' => [
+
+        'stack' => [
+            'driver' => 'stack',
+            'channels' => explode(',', env('LOG_STACK', 'single')),
+            'ignore_exceptions' => false,
+        ],
+
+        'single' => [
+            'driver' => 'single',
+            'path' => storage_path('logs/laravel.log'),
+            'level' => env('LOG_LEVEL', 'debug'),
+            'replace_placeholders' => true,
+        ],
+
+        'daily' => [
+            'driver' => 'daily',
+            'path' => storage_path('logs/laravel.log'),
+            'level' => env('LOG_LEVEL', 'debug'),
+            'days' => env('LOG_DAILY_DAYS', 14),
+            'replace_placeholders' => true,
+        ],
+
+        'slack' => [
+            'driver' => 'slack',
+            'url' => env('LOG_SLACK_WEBHOOK_URL'),
+            'username' => env('LOG_SLACK_USERNAME', 'Laravel Log'),
+            'emoji' => env('LOG_SLACK_EMOJI', ':boom:'),
+            'level' => env('LOG_LEVEL', 'critical'),
+            'replace_placeholders' => true,
+        ],
+
+        'papertrail' => [
+            'driver' => 'monolog',
+            'level' => env('LOG_LEVEL', 'debug'),
+            'handler' => env('LOG_PAPERTRAIL_HANDLER', SyslogUdpHandler::class),
+            'handler_with' => [
+                'host' => env('PAPERTRAIL_URL'),
+                'port' => env('PAPERTRAIL_PORT'),
+                'connectionString' => 'tls://'.env('PAPERTRAIL_URL').':'.env('PAPERTRAIL_PORT'),
+            ],
+            'processors' => [PsrLogMessageProcessor::class],
+        ],
+
+        'stderr' => [
+            'driver' => 'monolog',
+            'level' => env('LOG_LEVEL', 'debug'),
+            'handler' => StreamHandler::class,
+            'formatter' => env('LOG_STDERR_FORMATTER'),
+            'with' => [
+                'stream' => 'php://stderr',
+            ],
+            'processors' => [PsrLogMessageProcessor::class],
+        ],
+
+        'syslog' => [
+            'driver' => 'syslog',
+            'level' => env('LOG_LEVEL', 'debug'),
+            'facility' => env('LOG_SYSLOG_FACILITY', LOG_USER),
+            'replace_placeholders' => true,
+        ],
+
+        'errorlog' => [
+            'driver' => 'errorlog',
+            'level' => env('LOG_LEVEL', 'debug'),
+            'replace_placeholders' => true,
+        ],
+
+        'null' => [
+            'driver' => 'monolog',
+            'handler' => NullHandler::class,
+        ],
+
+        'emergency' => [
+            'path' => storage_path('logs/laravel.log'),
+        ],
+
+    ],
+
+];
diff --git a/config/mail.php b/config/mail.php
new file mode 100644
index 0000000..a4a02fe
--- /dev/null
+++ b/config/mail.php
@@ -0,0 +1,103 @@
+<?php
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Default Mailer
+    |--------------------------------------------------------------------------
+    |
+    | This option controls the default mailer that is used to send all email
+    | messages unless another mailer is explicitly specified when sending
+    | the message. All additional mailers can be configured within the
+    | "mailers" array. Examples of each type of mailer are provided.
+    |
+    */
+
+    'default' => env('MAIL_MAILER', 'log'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Mailer Configurations
+    |--------------------------------------------------------------------------
+    |
+    | Here you may configure all of the mailers used by your application plus
+    | their respective settings. Several examples have been configured for
+    | you and you are free to add your own as your application requires.
+    |
+    | Laravel supports a variety of mail "transport" drivers that can be used
+    | when delivering an email. You may specify which one you're using for
+    | your mailers below. You may also add additional mailers if needed.
+    |
+    | Supported: "smtp", "sendmail", "mailgun", "ses", "ses-v2",
+    |            "postmark", "log", "array", "failover", "roundrobin"
+    |
+    */
+
+    'mailers' => [
+
+        'smtp' => [
+            'transport' => 'smtp',
+            'url' => env('MAIL_URL'),
+            'host' => env('MAIL_HOST', '127.0.0.1'),
+            'port' => env('MAIL_PORT', 2525),
+            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
+            'username' => env('MAIL_USERNAME'),
+            'password' => env('MAIL_PASSWORD'),
+            'timeout' => null,
+            'local_domain' => env('MAIL_EHLO_DOMAIN'),
+        ],
+
+        'ses' => [
+            'transport' => 'ses',
+        ],
+
+        'postmark' => [
+            'transport' => 'postmark',
+            // 'message_stream_id' => env('POSTMARK_MESSAGE_STREAM_ID'),
+            // 'client' => [
+            //     'timeout' => 5,
+            // ],
+        ],
+
+        'sendmail' => [
+            'transport' => 'sendmail',
+            'path' => env('MAIL_SENDMAIL_PATH', '/usr/sbin/sendmail -bs -i'),
+        ],
+
+        'log' => [
+            'transport' => 'log',
+            'channel' => env('MAIL_LOG_CHANNEL'),
+        ],
+
+        'array' => [
+            'transport' => 'array',
+        ],
+
+        'failover' => [
+            'transport' => 'failover',
+            'mailers' => [
+                'smtp',
+                'log',
+            ],
+        ],
+
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Global "From" Address
+    |--------------------------------------------------------------------------
+    |
+    | You may wish for all emails sent by your application to be sent from
+    | the same address. Here you may specify a name and address that is
+    | used globally for all emails that are sent by your application.
+    |
+    */
+
+    'from' => [
+        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
+        'name' => env('MAIL_FROM_NAME', 'Example'),
+    ],
+
+];
diff --git a/config/queue.php b/config/queue.php
new file mode 100644
index 0000000..4f689e9
--- /dev/null
+++ b/config/queue.php
@@ -0,0 +1,112 @@
+<?php
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Default Queue Connection Name
+    |--------------------------------------------------------------------------
+    |
+    | Laravel's queue supports a variety of backends via a single, unified
+    | API, giving you convenient access to each backend using identical
+    | syntax for each. The default queue connection is defined below.
+    |
+    */
+
+    'default' => env('QUEUE_CONNECTION', 'database'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Queue Connections
+    |--------------------------------------------------------------------------
+    |
+    | Here you may configure the connection options for every queue backend
+    | used by your application. An example configuration is provided for
+    | each backend supported by Laravel. You're also free to add more.
+    |
+    | Drivers: "sync", "database", "beanstalkd", "sqs", "redis", "null"
+    |
+    */
+
+    'connections' => [
+
+        'sync' => [
+            'driver' => 'sync',
+        ],
+
+        'database' => [
+            'driver' => 'database',
+            'connection' => env('DB_QUEUE_CONNECTION', null),
+            'table' => env('DB_QUEUE_TABLE', 'jobs'),
+            'queue' => env('DB_QUEUE', 'default'),
+            'retry_after' => env('DB_QUEUE_RETRY_AFTER', 90),
+            'after_commit' => false,
+        ],
+
+        'beanstalkd' => [
+            'driver' => 'beanstalkd',
+            'host' => env('BEANSTALKD_QUEUE_HOST', 'localhost'),
+            'queue' => env('BEANSTALKD_QUEUE', 'default'),
+            'retry_after' => env('BEANSTALKD_QUEUE_RETRY_AFTER', 90),
+            'block_for' => 0,
+            'after_commit' => false,
+        ],
+
+        'sqs' => [
+            'driver' => 'sqs',
+            'key' => env('AWS_ACCESS_KEY_ID'),
+            'secret' => env('AWS_SECRET_ACCESS_KEY'),
+            'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
+            'queue' => env('SQS_QUEUE', 'default'),
+            'suffix' => env('SQS_SUFFIX'),
+            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
+            'after_commit' => false,
+        ],
+
+        'redis' => [
+            'driver' => 'redis',
+            'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
+            'queue' => env('REDIS_QUEUE', 'default'),
+            'retry_after' => env('REDIS_QUEUE_RETRY_AFTER', 90),
+            'block_for' => null,
+            'after_commit' => false,
+        ],
+
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Job Batching
+    |--------------------------------------------------------------------------
+    |
+    | The following options configure the database and table that store job
+    | batching information. These options can be updated to any database
+    | connection and table which has been defined by your application.
+    |
+    */
+
+    'batching' => [
+        'database' => env('DB_CONNECTION', 'sqlite'),
+        'table' => 'job_batches',
+    ],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Failed Queue Jobs
+    |--------------------------------------------------------------------------
+    |
+    | These options configure the behavior of failed queue job logging so you
+    | can control how and where failed jobs are stored. Laravel ships with
+    | support for storing failed jobs in a simple file or in a database.
+    |
+    | Supported drivers: "database-uuids", "dynamodb", "file", "null"
+    |
+    */
+
+    'failed' => [
+        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
+        'database' => env('DB_CONNECTION', 'sqlite'),
+        'table' => 'failed_jobs',
+    ],
+
+];
diff --git a/config/services.php b/config/services.php
new file mode 100644
index 0000000..6bb68f6
--- /dev/null
+++ b/config/services.php
@@ -0,0 +1,34 @@
+<?php
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Third Party Services
+    |--------------------------------------------------------------------------
+    |
+    | This file is for storing the credentials for third party services such
+    | as Mailgun, Postmark, AWS and more. This file provides the de facto
+    | location for this type of information, allowing packages to have
+    | a conventional file to locate the various service credentials.
+    |
+    */
+
+    'postmark' => [
+        'token' => env('POSTMARK_TOKEN'),
+    ],
+
+    'ses' => [
+        'key' => env('AWS_ACCESS_KEY_ID'),
+        'secret' => env('AWS_SECRET_ACCESS_KEY'),
+        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
+    ],
+
+    'slack' => [
+        'notifications' => [
+            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
+            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
+        ],
+    ],
+
+];
diff --git a/config/session.php b/config/session.php
new file mode 100644
index 0000000..0e22ee4
--- /dev/null
+++ b/config/session.php
@@ -0,0 +1,218 @@
+<?php
+
+use Illuminate\Support\Str;
+
+return [
+
+    /*
+    |--------------------------------------------------------------------------
+    | Default Session Driver
+    |--------------------------------------------------------------------------
+    |
+    | This option determines the default session driver that is utilized for
+    | incoming requests. Laravel supports a variety of storage options to
+    | persist session data. Database storage is a great default choice.
+    |
+    | Supported: "file", "cookie", "database", "apc",
+    |            "memcached", "redis", "dynamodb", "array"
+    |
+    */
+
+    'driver' => env('SESSION_DRIVER', 'database'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session Lifetime
+    |--------------------------------------------------------------------------
+    |
+    | Here you may specify the number of minutes that you wish the session
+    | to be allowed to remain idle before it expires. If you want them
+    | to expire immediately when the browser is closed then you may
+    | indicate that via the expire_on_close configuration option.
+    |
+    */
+
+    'lifetime' => env('SESSION_LIFETIME', 120),
+
+    'expire_on_close' => env('SESSION_EXPIRE_ON_CLOSE', false),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session Encryption
+    |--------------------------------------------------------------------------
+    |
+    | This option allows you to easily specify that all of your session data
+    | should be encrypted before it's stored. All encryption is performed
+    | automatically by Laravel and you may use the session like normal.
+    |
+    */
+
+    'encrypt' => env('SESSION_ENCRYPT', false),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session File Location
+    |--------------------------------------------------------------------------
+    |
+    | When utilizing the "file" session driver, the session files are placed
+    | on disk. The default storage location is defined here; however, you
+    | are free to provide another location where they should be stored.
+    |
+    */
+
+    'files' => storage_path('framework/sessions'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session Database Connection
+    |--------------------------------------------------------------------------
+    |
+    | When using the "database" or "redis" session drivers, you may specify a
+    | connection that should be used to manage these sessions. This should
+    | correspond to a connection in your database configuration options.
+    |
+    */
+
+    'connection' => env('SESSION_CONNECTION'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session Database Table
+    |--------------------------------------------------------------------------
+    |
+    | When using the "database" session driver, you may specify the table to
+    | be used to store sessions. Of course, a sensible default is defined
+    | for you; however, you're welcome to change this to another table.
+    |
+    */
+
+    'table' => env('SESSION_TABLE', 'sessions'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session Cache Store
+    |--------------------------------------------------------------------------
+    |
+    | When using one of the framework's cache driven session backends, you may
+    | define the cache store which should be used to store the session data
+    | between requests. This must match one of your defined cache stores.
+    |
+    | Affects: "apc", "dynamodb", "memcached", "redis"
+    |
+    */
+
+    'store' => env('SESSION_STORE'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session Sweeping Lottery
+    |--------------------------------------------------------------------------
+    |
+    | Some session drivers must manually sweep their storage location to get
+    | rid of old sessions from storage. Here are the chances that it will
+    | happen on a given request. By default, the odds are 2 out of 100.
+    |
+    */
+
+    'lottery' => [2, 100],
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session Cookie Name
+    |--------------------------------------------------------------------------
+    |
+    | Here you may change the name of the session cookie that is created by
+    | the framework. Typically, you should not need to change this value
+    | since doing so does not grant a meaningful security improvement.
+    |
+    |
+    */
+
+    'cookie' => env(
+        'SESSION_COOKIE',
+        Str::slug(env('APP_NAME', 'laravel'), '_').'_session'
+    ),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session Cookie Path
+    |--------------------------------------------------------------------------
+    |
+    | The session cookie path determines the path for which the cookie will
+    | be regarded as available. Typically, this will be the root path of
+    | your application, but you're free to change this when necessary.
+    |
+    */
+
+    'path' => env('SESSION_PATH', '/'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Session Cookie Domain
+    |--------------------------------------------------------------------------
+    |
+    | This value determines the domain and subdomains the session cookie is
+    | available to. By default, the cookie will be available to the root
+    | domain and all subdomains. Typically, this shouldn't be changed.
+    |
+    */
+
+    'domain' => env('SESSION_DOMAIN'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | HTTPS Only Cookies
+    |--------------------------------------------------------------------------
+    |
+    | By setting this option to true, session cookies will only be sent back
+    | to the server if the browser has a HTTPS connection. This will keep
+    | the cookie from being sent to you when it can't be done securely.
+    |
+    */
+
+    'secure' => env('SESSION_SECURE_COOKIE'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | HTTP Access Only
+    |--------------------------------------------------------------------------
+    |
+    | Setting this value to true will prevent JavaScript from accessing the
+    | value of the cookie and the cookie will only be accessible through
+    | the HTTP protocol. It's unlikely you should disable this option.
+    |
+    */
+
+    'http_only' => env('SESSION_HTTP_ONLY', true),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Same-Site Cookies
+    |--------------------------------------------------------------------------
+    |
+    | This option determines how your cookies behave when cross-site requests
+    | take place, and can be used to mitigate CSRF attacks. By default, we
+    | will set this value to "lax" to permit secure cross-site requests.
+    |
+    | See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
+    |
+    | Supported: "lax", "strict", "none", null
+    |
+    */
+
+    'same_site' => env('SESSION_SAME_SITE', 'lax'),
+
+    /*
+    |--------------------------------------------------------------------------
+    | Partitioned Cookies
+    |--------------------------------------------------------------------------
+    |
+    | Setting this value to true will tie the cookie to the top-level site for
+    | a cross-site context. Partitioned cookies are accepted by the browser
+    | when flagged "secure" and the Same-Site attribute is set to "none".
+    |
+    */
+
+    'partitioned' => env('SESSION_PARTITIONED_COOKIE', false),
+
+];
diff --git a/database/.gitignore b/database/.gitignore
new file mode 100644
index 0000000..9b19b93
--- /dev/null
+++ b/database/.gitignore
@@ -0,0 +1 @@
+*.sqlite*
diff --git a/database/factories/UserFactory.php b/database/factories/UserFactory.php
new file mode 100644
index 0000000..584104c
--- /dev/null
+++ b/database/factories/UserFactory.php
@@ -0,0 +1,44 @@
+<?php
+
+namespace Database\Factories;
+
+use Illuminate\Database\Eloquent\Factories\Factory;
+use Illuminate\Support\Facades\Hash;
+use Illuminate\Support\Str;
+
+/**
+ * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
+ */
+class UserFactory extends Factory
+{
+    /**
+     * The current password being used by the factory.
+     */
+    protected static ?string $password;
+
+    /**
+     * Define the model's default state.
+     *
+     * @return array<string, mixed>
+     */
+    public function definition(): array
+    {
+        return [
+            'name' => fake()->name(),
+            'email' => fake()->unique()->safeEmail(),
+            'email_verified_at' => now(),
+            'password' => static::$password ??= Hash::make('password'),
+            'remember_token' => Str::random(10),
+        ];
+    }
+
+    /**
+     * Indicate that the model's email address should be unverified.
+     */
+    public function unverified(): static
+    {
+        return $this->state(fn (array $attributes) => [
+            'email_verified_at' => null,
+        ]);
+    }
+}
diff --git a/database/migrations/0001_01_01_000000_create_users_table.php b/database/migrations/0001_01_01_000000_create_users_table.php
new file mode 100644
index 0000000..05fb5d9
--- /dev/null
+++ b/database/migrations/0001_01_01_000000_create_users_table.php
@@ -0,0 +1,49 @@
+<?php
+
+use Illuminate\Database\Migrations\Migration;
+use Illuminate\Database\Schema\Blueprint;
+use Illuminate\Support\Facades\Schema;
+
+return new class extends Migration
+{
+    /**
+     * Run the migrations.
+     */
+    public function up(): void
+    {
+        Schema::create('users', function (Blueprint $table) {
+            $table->id();
+            $table->string('name');
+            $table->string('email')->unique();
+            $table->timestamp('email_verified_at')->nullable();
+            $table->string('password');
+            $table->rememberToken();
+            $table->timestamps();
+        });
+
+        Schema::create('password_reset_tokens', function (Blueprint $table) {
+            $table->string('email')->primary();
+            $table->string('token');
+            $table->timestamp('created_at')->nullable();
+        });
+
+        Schema::create('sessions', function (Blueprint $table) {
+            $table->string('id')->primary();
+            $table->foreignId('user_id')->nullable()->index();
+            $table->string('ip_address', 45)->nullable();
+            $table->text('user_agent')->nullable();
+            $table->longText('payload');
+            $table->integer('last_activity')->index();
+        });
+    }
+
+    /**
+     * Reverse the migrations.
+     */
+    public function down(): void
+    {
+        Schema::dropIfExists('users');
+        Schema::dropIfExists('password_reset_tokens');
+        Schema::dropIfExists('sessions');
+    }
+};
diff --git a/database/migrations/0001_01_01_000001_create_cache_table.php b/database/migrations/0001_01_01_000001_create_cache_table.php
new file mode 100644
index 0000000..b9c106b
--- /dev/null
+++ b/database/migrations/0001_01_01_000001_create_cache_table.php
@@ -0,0 +1,35 @@
+<?php
+
+use Illuminate\Database\Migrations\Migration;
+use Illuminate\Database\Schema\Blueprint;
+use Illuminate\Support\Facades\Schema;
+
+return new class extends Migration
+{
+    /**
+     * Run the migrations.
+     */
+    public function up(): void
+    {
+        Schema::create('cache', function (Blueprint $table) {
+            $table->string('key')->primary();
+            $table->mediumText('value');
+            $table->integer('expiration');
+        });
+
+        Schema::create('cache_locks', function (Blueprint $table) {
+            $table->string('key')->primary();
+            $table->string('owner');
+            $table->integer('expiration');
+        });
+    }
+
+    /**
+     * Reverse the migrations.
+     */
+    public function down(): void
+    {
+        Schema::dropIfExists('cache');
+        Schema::dropIfExists('cache_locks');
+    }
+};
diff --git a/database/migrations/0001_01_01_000002_create_jobs_table.php b/database/migrations/0001_01_01_000002_create_jobs_table.php
new file mode 100644
index 0000000..425e705
--- /dev/null
+++ b/database/migrations/0001_01_01_000002_create_jobs_table.php
@@ -0,0 +1,57 @@
+<?php
+
+use Illuminate\Database\Migrations\Migration;
+use Illuminate\Database\Schema\Blueprint;
+use Illuminate\Support\Facades\Schema;
+
+return new class extends Migration
+{
+    /**
+     * Run the migrations.
+     */
+    public function up(): void
+    {
+        Schema::create('jobs', function (Blueprint $table) {
+            $table->id();
+            $table->string('queue')->index();
+            $table->longText('payload');
+            $table->unsignedTinyInteger('attempts');
+            $table->unsignedInteger('reserved_at')->nullable();
+            $table->unsignedInteger('available_at');
+            $table->unsignedInteger('created_at');
+        });
+
+        Schema::create('job_batches', function (Blueprint $table) {
+            $table->string('id')->primary();
+            $table->string('name');
+            $table->integer('total_jobs');
+            $table->integer('pending_jobs');
+            $table->integer('failed_jobs');
+            $table->longText('failed_job_ids');
+            $table->mediumText('options')->nullable();
+            $table->integer('cancelled_at')->nullable();
+            $table->integer('created_at');
+            $table->integer('finished_at')->nullable();
+        });
+
+        Schema::create('failed_jobs', function (Blueprint $table) {
+            $table->id();
+            $table->string('uuid')->unique();
+            $table->text('connection');
+            $table->text('queue');
+            $table->longText('payload');
+            $table->longText('exception');
+            $table->timestamp('failed_at')->useCurrent();
+        });
+    }
+
+    /**
+     * Reverse the migrations.
+     */
+    public function down(): void
+    {
+        Schema::dropIfExists('jobs');
+        Schema::dropIfExists('job_batches');
+        Schema::dropIfExists('failed_jobs');
+    }
+};
diff --git a/database/migrations/2026_05_11_200205_add_two_factor_columns_to_users_table.php b/database/migrations/2026_05_11_200205_add_two_factor_columns_to_users_table.php
new file mode 100644
index 0000000..45739ef
--- /dev/null
+++ b/database/migrations/2026_05_11_200205_add_two_factor_columns_to_users_table.php
@@ -0,0 +1,42 @@
+<?php
+
+use Illuminate\Database\Migrations\Migration;
+use Illuminate\Database\Schema\Blueprint;
+use Illuminate\Support\Facades\Schema;
+
+return new class extends Migration
+{
+    /**
+     * Run the migrations.
+     */
+    public function up(): void
+    {
+        Schema::table('users', function (Blueprint $table) {
+            $table->text('two_factor_secret')
+                ->after('password')
+                ->nullable();
+
+            $table->text('two_factor_recovery_codes')
+                ->after('two_factor_secret')
+                ->nullable();
+
+            $table->timestamp('two_factor_confirmed_at')
+                ->after('two_factor_recovery_codes')
+                ->nullable();
+        });
+    }
+
+    /**
+     * Reverse the migrations.
+     */
+    public function down(): void
+    {
+        Schema::table('users', function (Blueprint $table) {
+            $table->dropColumn([
+                'two_factor_secret',
+                'two_factor_recovery_codes',
+                'two_factor_confirmed_at',
+            ]);
+        });
+    }
+};
diff --git a/database/migrations/2026_05_11_200206_create_passkeys_table.php b/database/migrations/2026_05_11_200206_create_passkeys_table.php
new file mode 100644
index 0000000..a0b9e7d
--- /dev/null
+++ b/database/migrations/2026_05_11_200206_create_passkeys_table.php
@@ -0,0 +1,35 @@
+<?php
+
+use Illuminate\Database\Migrations\Migration;
+use Illuminate\Database\Schema\Blueprint;
+use Illuminate\Support\Facades\Schema;
+use Laravel\Passkeys\Passkeys;
+
+return new class extends Migration
+{
+    /**
+     * Run the migrations.
+     */
+    public function up(): void
+    {
+        Schema::create('passkeys', function (Blueprint $table) {
+            $table->id();
+            $table->foreignIdFor(Passkeys::userModel(), 'user_id')->constrained()->cascadeOnDelete();
+            $table->string('name');
+            $table->string('credential_id')->unique();
+            $table->json('credential');
+            $table->timestamp('last_used_at')->nullable();
+            $table->timestamps();
+
+            $table->index('user_id');
+        });
+    }
+
+    /**
+     * Reverse the migrations.
+     */
+    public function down(): void
+    {
+        Schema::dropIfExists('passkeys');
+    }
+};
diff --git a/database/seeders/DatabaseSeeder.php b/database/seeders/DatabaseSeeder.php
new file mode 100644
index 0000000..d01a0ef
--- /dev/null
+++ b/database/seeders/DatabaseSeeder.php
@@ -0,0 +1,23 @@
+<?php
+
+namespace Database\Seeders;
+
+use App\Models\User;
+// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
+use Illuminate\Database\Seeder;
+
+class DatabaseSeeder extends Seeder
+{
+    /**
+     * Seed the application's database.
+     */
+    public function run(): void
+    {
+        // User::factory(10)->create();
+
+        User::factory()->create([
+            'name' => 'Test User',
+            'email' => 'test@example.com',
+        ]);
+    }
+}
diff --git a/package.json b/package.json
new file mode 100644
index 0000000..b512d98
--- /dev/null
+++ b/package.json
@@ -0,0 +1,19 @@
+{
+    "private": true,
+    "type": "module",
+    "scripts": {
+        "dev": "vite",
+        "build": "vite build"
+    },
+    "devDependencies": {
+        "@vitejs/plugin-react": "^4.7.0",
+        "axios": "^1.6.4",
+        "laravel-vite-plugin": "^1.0",
+        "vite": "^5.0"
+    },
+    "dependencies": {
+        "@inertiajs/react": "^3.1.1",
+        "react": "^19.2.6",
+        "react-dom": "^19.2.6"
+    }
+}
diff --git a/phpunit.xml b/phpunit.xml
new file mode 100644
index 0000000..7205386
--- /dev/null
+++ b/phpunit.xml
@@ -0,0 +1,33 @@
+<?xml version="1.0" encoding="UTF-8"?>
+<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
+         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
+         bootstrap="vendor/autoload.php"
+         colors="true"
+>
+    <testsuites>
+        <testsuite name="Unit">
+            <directory>tests/Backend/Unit</directory>
+        </testsuite>
+        <testsuite name="Feature">
+            <directory>tests/Backend/Feature</directory>
+        </testsuite>
+    </testsuites>
+    <source>
+        <include>
+            <directory>app</directory>
+        </include>
+    </source>
+    <php>
+        <env name="APP_ENV" value="testing"/>
+        <env name="APP_MAINTENANCE_DRIVER" value="file"/>
+        <env name="BCRYPT_ROUNDS" value="4"/>
+        <env name="CACHE_STORE" value="array"/>
+        <!-- <env name="DB_CONNECTION" value="sqlite"/> -->
+        <!-- <env name="DB_DATABASE" value=":memory:"/> -->
+        <env name="MAIL_MAILER" value="array"/>
+        <env name="PULSE_ENABLED" value="false"/>
+        <env name="QUEUE_CONNECTION" value="sync"/>
+        <env name="SESSION_DRIVER" value="array"/>
+        <env name="TELESCOPE_ENABLED" value="false"/>
+    </php>
+</phpunit>
diff --git a/resources/css/app.css b/resources/css/app.css
new file mode 100644
index 0000000..86b3f57
--- /dev/null
+++ b/resources/css/app.css
@@ -0,0 +1,47 @@
+/* Vortex Ebony Design System */
+
+:root {
+    --v-black: #000000;
+    --v-ebony: #0a0a0a;
+    --v-gray-dark: #121212;
+    --v-gray-medium: #1e1e1e;
+    --v-gray-light: #2a2a2a;
+    --v-text-primary: #ffffff;
+    --v-text-secondary: #a0a0a0;
+    --v-accent: #3b82f6; /* Initial blue accent */
+    --v-error: #ef4444;
+    --v-success: #22c55e;
+}
+
+/* Base Reset */
+* {
+    margin: 0;
+    padding: 0;
+    box-sizing: border-box;
+}
+
+body {
+    background-color: var(--v-black);
+    color: var(--v-text-primary);
+    font-family: 'Inter', sans-serif;
+    line-height: 1.5;
+    -webkit-font-smoothing: antialiased;
+}
+
+/* Scrollbar Styling */
+::-webkit-scrollbar {
+    width: 8px;
+}
+
+::-webkit-scrollbar-track {
+    background: var(--v-black);
+}
+
+::-webkit-scrollbar-thumb {
+    background: var(--v-gray-medium);
+    border-radius: 4px;
+}
+
+::-webkit-scrollbar-thumb:hover {
+    background: var(--v-gray-light);
+}
diff --git a/resources/js/Pages/Dashboard.jsx b/resources/js/Pages/Dashboard.jsx
new file mode 100644
index 0000000..987ab95
--- /dev/null
+++ b/resources/js/Pages/Dashboard.jsx
@@ -0,0 +1,29 @@
+import React from 'react';
+import { Head } from '@inertiajs/react';
+
+export default function Dashboard() {
+    return (
+        <>
+            <Head title="Dashboard" />
+            <div className="min-h-screen flex items-center justify-center bg-black">
+                <div className="p-8 border border-v-gray-medium rounded-lg bg-v-ebony shadow-2xl">
+                    <h1 className="text-3xl font-bold text-white mb-4">Vortex Engine</h1>
+                    <p className="text-v-text-secondary">
+                        System initialized. Manual bootstrap complete.
+                    </p>
+                    <div className="mt-6 flex gap-4">
+                        <span className="px-3 py-1 bg-v-gray-medium text-xs rounded text-v-success border border-v-gray-light">
+                            PHP 8.4
+                        </span>
+                        <span className="px-3 py-1 bg-v-gray-medium text-xs rounded text-v-success border border-v-gray-light">
+                            Laravel 11
+                        </span>
+                        <span className="px-3 py-1 bg-v-gray-medium text-xs rounded text-v-success border border-v-gray-light">
+                            React 18
+                        </span>
+                    </div>
+                </div>
+            </div>
+        </>
+    );
+}
diff --git a/resources/js/app.jsx b/resources/js/app.jsx
new file mode 100644
index 0000000..bb87eef
--- /dev/null
+++ b/resources/js/app.jsx
@@ -0,0 +1,21 @@
+import './bootstrap';
+import '../css/app.css';
+
+import { createRoot } from 'react-dom/client';
+import { createInertiaApp } from '@inertiajs/react';
+import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
+
+const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';
+
+createInertiaApp({
+    title: (title) => `${title} - ${appName}`,
+    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
+    setup({ el, App, props }) {
+        const root = createRoot(el);
+
+        root.render(<App {...props} />);
+    },
+    progress: {
+        color: '#4B5563',
+    },
+});
diff --git a/resources/js/bootstrap.js b/resources/js/bootstrap.js
new file mode 100644
index 0000000..5f1390b
--- /dev/null
+++ b/resources/js/bootstrap.js
@@ -0,0 +1,4 @@
+import axios from 'axios';
+window.axios = axios;
+
+window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
diff --git a/resources/views/app.blade.php b/resources/views/app.blade.php
new file mode 100644
index 0000000..9f0402f
--- /dev/null
+++ b/resources/views/app.blade.php
@@ -0,0 +1,23 @@
+<!DOCTYPE html>
+<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
+    <head>
+        <meta charset="utf-8">
+        <meta name="viewport" content="width=device-width, initial-scale=1">
+
+        <title inertia>{{ config('app.name', 'Laravel') }}</title>
+
+        <!-- Fonts -->
+        <link rel="preconnect" href="https://fonts.googleapis.com">
+        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
+        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
+
+        <!-- Scripts -->
+        @routes
+        @viteReactRefresh
+        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
+        @inertiaHead
+    </head>
+    <body class="font-sans antialiased bg-black text-white">
+        @inertia
+    </body>
+</html>
diff --git a/resources/views/welcome.blade.php b/resources/views/welcome.blade.php
new file mode 100644
index 0000000..7b626b1
--- /dev/null
+++ b/resources/views/welcome.blade.php
@@ -0,0 +1,172 @@
+<!DOCTYPE html>
+<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
+    <head>
+        <meta charset="utf-8">
+        <meta name="viewport" content="width=device-width, initial-scale=1">
+
+        <title>Laravel</title>
+
+        <!-- Fonts -->
+        <link rel="preconnect" href="https://fonts.bunny.net">
+        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
+
+        <!-- Styles -->
+        <style>
+            /* ! tailwindcss v3.4.1 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:Figtree, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.absolute{position:absolute}.relative{position:relative}.-left-20{left:-5rem}.top-0{top:0px}.-bottom-16{bottom:-4rem}.-left-16{left:-4rem}.-mx-3{margin-left:-0.75rem;margin-right:-0.75rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.flex{display:flex}.grid{display:grid}.hidden{display:none}.aspect-video{aspect-ratio:16 / 9}.size-12{width:3rem;height:3rem}.size-5{width:1.25rem;height:1.25rem}.size-6{width:1.5rem;height:1.5rem}.h-12{height:3rem}.h-40{height:10rem}.h-full{height:100%}.min-h-screen{min-height:100vh}.w-full{width:100%}.w-\[calc\(100\%\+8rem\)\]{width:calc(100% + 8rem)}.w-auto{width:auto}.max-w-\[877px\]{max-width:877px}.max-w-2xl{max-width:42rem}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr))}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.items-stretch{align-items:stretch}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.gap-2{gap:0.5rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.self-center{align-self:center}.overflow-hidden{overflow:hidden}.rounded-\[10px\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-md{border-radius:0.375rem}.rounded-sm{border-radius:0.125rem}.bg-\[\#FF2D20\]\/10{background-color:rgb(255 45 32 / 0.1)}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-gradient-to-b{background-image:linear-gradient(to bottom, var(--tw-gradient-stops))}.from-transparent{--tw-gradient-from:transparent var(--tw-gradient-from-position);--tw-gradient-to:rgb(0 0 0 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), var(--tw-gradient-to)}.via-white{--tw-gradient-to:rgb(255 255 255 / 0)  var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), #fff var(--tw-gradient-via-position), var(--tw-gradient-to)}.to-white{--tw-gradient-to:#fff var(--tw-gradient-to-position)}.stroke-\[\#FF2D20\]{stroke:#FF2D20}.object-cover{object-fit:cover}.object-top{object-position:top}.p-6{padding:1.5rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}.px-3{padding-left:0.75rem;padding-right:0.75rem}.py-16{padding-top:4rem;padding-bottom:4rem}.py-2{padding-top:0.5rem;padding-bottom:0.5rem}.pt-3{padding-top:0.75rem}.text-center{text-align:center}.font-sans{font-family:Figtree, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-sm\/relaxed{font-size:0.875rem;line-height:1.625}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-semibold{font-weight:600}.text-black{--tw-text-opacity:1;color:rgb(0 0 0 / var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.underline{-webkit-text-decoration-line:underline;text-decoration-line:underline}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.shadow-\[0px_14px_34px_0px_rgba\(0\2c 0\2c 0\2c 0\.08\)\]{--tw-shadow:0px 14px 34px 0px rgba(0,0,0,0.08);--tw-shadow-colored:0px 14px 34px 0px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.ring-1{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.ring-transparent{--tw-ring-color:transparent}.ring-white\/\[0\.05\]{--tw-ring-color:rgb(255 255 255 / 0.05)}.drop-shadow-\[0px_4px_34px_rgba\(0\2c 0\2c 0\2c 0\.06\)\]{--tw-drop-shadow:drop-shadow(0px 4px 34px rgba(0,0,0,0.06));filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.drop-shadow-\[0px_4px_34px_rgba\(0\2c 0\2c 0\2c 0\.25\)\]{--tw-drop-shadow:drop-shadow(0px 4px 34px rgba(0,0,0,0.25));filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.duration-300{transition-duration:300ms}.selection\:bg-\[\#FF2D20\] *::selection{--tw-bg-opacity:1;background-color:rgb(255 45 32 / var(--tw-bg-opacity))}.selection\:text-white *::selection{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.selection\:bg-\[\#FF2D20\]::selection{--tw-bg-opacity:1;background-color:rgb(255 45 32 / var(--tw-bg-opacity))}.selection\:text-white::selection{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.hover\:text-black:hover{--tw-text-opacity:1;color:rgb(0 0 0 / var(--tw-text-opacity))}.hover\:text-black\/70:hover{color:rgb(0 0 0 / 0.7)}.hover\:ring-black\/20:hover{--tw-ring-color:rgb(0 0 0 / 0.2)}.focus\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus-visible\:ring-1:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.focus-visible\:ring-\[\#FF2D20\]:focus-visible{--tw-ring-opacity:1;--tw-ring-color:rgb(255 45 32 / var(--tw-ring-opacity))}@media (min-width: 640px){.sm\:size-16{width:4rem;height:4rem}.sm\:size-6{width:1.5rem;height:1.5rem}.sm\:pt-5{padding-top:1.25rem}}@media (min-width: 768px){.md\:row-span-3{grid-row:span 3 / span 3}}@media (min-width: 1024px){.lg\:col-start-2{grid-column-start:2}.lg\:h-16{height:4rem}.lg\:max-w-7xl{max-width:80rem}.lg\:grid-cols-3{grid-template-columns:repeat(3, minmax(0, 1fr))}.lg\:grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr))}.lg\:flex-col{flex-direction:column}.lg\:items-end{align-items:flex-end}.lg\:justify-center{justify-content:center}.lg\:gap-8{gap:2rem}.lg\:p-10{padding:2.5rem}.lg\:pb-10{padding-bottom:2.5rem}.lg\:pt-0{padding-top:0px}.lg\:text-\[\#FF2D20\]{--tw-text-opacity:1;color:rgb(255 45 32 / var(--tw-text-opacity))}}@media (prefers-color-scheme: dark){.dark\:block{display:block}.dark\:hidden{display:none}.dark\:bg-black{--tw-bg-opacity:1;background-color:rgb(0 0 0 / var(--tw-bg-opacity))}.dark\:bg-zinc-900{--tw-bg-opacity:1;background-color:rgb(24 24 27 / var(--tw-bg-opacity))}.dark\:via-zinc-900{--tw-gradient-to:rgb(24 24 27 / 0)  var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from), #18181b var(--tw-gradient-via-position), var(--tw-gradient-to)}.dark\:to-zinc-900{--tw-gradient-to:#18181b var(--tw-gradient-to-position)}.dark\:text-white\/50{color:rgb(255 255 255 / 0.5)}.dark\:text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.dark\:text-white\/70{color:rgb(255 255 255 / 0.7)}.dark\:ring-zinc-800{--tw-ring-opacity:1;--tw-ring-color:rgb(39 39 42 / var(--tw-ring-opacity))}.dark\:hover\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.dark\:hover\:text-white\/70:hover{color:rgb(255 255 255 / 0.7)}.dark\:hover\:text-white\/80:hover{color:rgb(255 255 255 / 0.8)}.dark\:hover\:ring-zinc-700:hover{--tw-ring-opacity:1;--tw-ring-color:rgb(63 63 70 / var(--tw-ring-opacity))}.dark\:focus-visible\:ring-\[\#FF2D20\]:focus-visible{--tw-ring-opacity:1;--tw-ring-color:rgb(255 45 32 / var(--tw-ring-opacity))}.dark\:focus-visible\:ring-white:focus-visible{--tw-ring-opacity:1;--tw-ring-color:rgb(255 255 255 / var(--tw-ring-opacity))}}
+        </style>
+    </head>
+    <body class="font-sans antialiased dark:bg-black dark:text-white/50">
+        <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
+            <img id="background" class="absolute -left-20 top-0 max-w-[877px]" src="https://laravel.com/assets/img/welcome/background.svg" />
+            <div class="relative min-h-screen flex flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
+                <div class="relative w-full max-w-2xl px-6 lg:max-w-7xl">
+                    <header class="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
+                        <div class="flex lg:justify-center lg:col-start-2">
+                            <svg class="h-12 w-auto text-white lg:h-16 lg:text-[#FF2D20]" viewBox="0 0 62 65" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M61.8548 14.6253C61.8778 14.7102 61.8895 14.7978 61.8897 14.8858V28.5615C61.8898 28.737 61.8434 28.9095 61.7554 29.0614C61.6675 29.2132 61.5409 29.3392 61.3887 29.4265L49.9104 36.0351V49.1337C49.9104 49.4902 49.7209 49.8192 49.4118 49.9987L25.4519 63.7916C25.3971 63.8227 25.3372 63.8427 25.2774 63.8639C25.255 63.8714 25.2338 63.8851 25.2101 63.8913C25.0426 63.9354 24.8666 63.9354 24.6991 63.8913C24.6716 63.8838 24.6467 63.8689 24.6205 63.8589C24.5657 63.8389 24.5084 63.8215 24.456 63.7916L0.501061 49.9987C0.348882 49.9113 0.222437 49.7853 0.134469 49.6334C0.0465019 49.4816 0.000120578 49.3092 0 49.1337L0 8.10652C0 8.01678 0.0124642 7.92953 0.0348998 7.84477C0.0423783 7.8161 0.0598282 7.78993 0.0697995 7.76126C0.0884958 7.70891 0.105946 7.65531 0.133367 7.6067C0.152063 7.5743 0.179485 7.54812 0.20192 7.51821C0.230588 7.47832 0.256763 7.43719 0.290416 7.40229C0.319084 7.37362 0.356476 7.35243 0.388883 7.32751C0.425029 7.29759 0.457436 7.26518 0.498568 7.2415L12.4779 0.345059C12.6296 0.257786 12.8015 0.211853 12.9765 0.211853C13.1515 0.211853 13.3234 0.257786 13.475 0.345059L25.4531 7.2415H25.4556C25.4955 7.26643 25.5292 7.29759 25.5653 7.32626C25.5977 7.35119 25.6339 7.37362 25.6625 7.40104C25.6974 7.43719 25.7224 7.47832 25.7523 7.51821C25.7735 7.54812 25.8021 7.5743 25.8196 7.6067C25.8483 7.65656 25.8645 7.70891 25.8844 7.76126C25.8944 7.78993 25.9118 7.8161 25.9193 7.84602C25.9423 7.93096 25.954 8.01853 25.9542 8.10652V33.7317L35.9355 27.9844V14.8846C35.9355 14.7973 35.948 14.7088 35.9704 14.6253C35.9792 14.5954 35.9954 14.5692 36.0053 14.5405C36.0253 14.4882 36.0427 14.4346 36.0702 14.386C36.0888 14.3536 36.1163 14.3274 36.1375 14.2975C36.1674 14.2576 36.1923 14.2165 36.2272 14.1816C36.2559 14.1529 36.292 14.1317 36.3244 14.1068C36.3618 14.0769 36.3942 14.0445 36.4341 14.0208L48.4147 7.12434C48.5663 7.03694 48.7383 6.99094 48.9133 6.99094C49.0883 6.99094 49.2602 7.03694 49.4118 7.12434L61.3899 14.0208C61.4323 14.0457 61.4647 14.0769 61.5021 14.1055C61.5333 14.1305 61.5694 14.1529 61.5981 14.1803C61.633 14.2165 61.6579 14.2576 61.6878 14.2975C61.7103 14.3274 61.7377 14.3536 61.7551 14.386C61.7838 14.4346 61.8 14.4882 61.8199 14.5405C61.8312 14.5692 61.8474 14.5954 61.8548 14.6253ZM59.893 27.9844V16.6121L55.7013 19.0252L49.9104 22.3593V33.7317L59.8942 27.9844H59.893ZM47.9149 48.5566V37.1768L42.2187 40.4299L25.953 49.7133V61.2003L47.9149 48.5566ZM1.99677 9.83281V48.5566L23.9562 61.199V49.7145L12.4841 43.2219L12.4804 43.2194L12.4754 43.2169C12.4368 43.1945 12.4044 43.1621 12.3682 43.1347C12.3371 43.1097 12.3009 43.0898 12.2735 43.0624L12.271 43.0586C12.2386 43.0275 12.2162 42.9888 12.1887 42.9539C12.1638 42.9203 12.1339 42.8916 12.114 42.8567L12.1127 42.853C12.0903 42.8156 12.0766 42.7707 12.0604 42.7283C12.0442 42.6909 12.023 42.656 12.013 42.6161C12.0005 42.5688 11.998 42.5177 11.9931 42.4691C11.9881 42.4317 11.9781 42.3943 11.9781 42.3569V15.5801L6.18848 12.2446L1.99677 9.83281ZM12.9777 2.36177L2.99764 8.10652L12.9752 13.8513L22.9541 8.10527L12.9752 2.36177H12.9777ZM18.1678 38.2138L23.9574 34.8809V9.83281L19.7657 12.2459L13.9749 15.5801V40.6281L18.1678 38.2138ZM48.9133 9.14105L38.9344 14.8858L48.9133 20.6305L58.8909 14.8846L48.9133 9.14105ZM47.9149 22.3593L42.124 19.0252L37.9323 16.6121V27.9844L43.7219 31.3174L47.9149 33.7317V22.3593ZM24.9533 47.987L39.59 39.631L46.9065 35.4555L36.9352 29.7145L25.4544 36.3242L14.9907 42.3482L24.9533 47.987Z" fill="currentColor"/></svg>
+                        </div>
+                        @if (Route::has('login'))
+                            <nav class="-mx-3 flex flex-1 justify-end">
+                                @auth
+                                    <a
+                                        href="{{ url('/dashboard') }}"
+                                        class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
+                                    >
+                                        Dashboard
+                                    </a>
+                                @else
+                                    <a
+                                        href="{{ route('login') }}"
+                                        class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
+                                    >
+                                        Log in
+                                    </a>
+
+                                    @if (Route::has('register'))
+                                        <a
+                                            href="{{ route('register') }}"
+                                            class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
+                                        >
+                                            Register
+                                        </a>
+                                    @endif
+                                @endauth
+                            </nav>
+                        @endif
+                    </header>
+
+                    <main class="mt-6">
+                        <div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
+                            <a
+                                href="https://laravel.com/docs"
+                                id="docs-card"
+                                class="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
+                            >
+                                <div id="screenshot-container" class="relative flex w-full flex-1 items-stretch">
+                                    <img
+                                        src="https://laravel.com/assets/img/welcome/docs-light.svg"
+                                        alt="Laravel documentation screenshot"
+                                        class="aspect-video h-full w-full flex-1 rounded-[10px] object-top object-cover drop-shadow-[0px_4px_34px_rgba(0,0,0,0.06)] dark:hidden"
+                                        onerror="
+                                            document.getElementById('screenshot-container').classList.add('!hidden');
+                                            document.getElementById('docs-card').classList.add('!row-span-1');
+                                            document.getElementById('docs-card-content').classList.add('!flex-row');
+                                            document.getElementById('background').classList.add('!hidden');
+                                        "
+                                    />
+                                    <img
+                                        src="https://laravel.com/assets/img/welcome/docs-dark.svg"
+                                        alt="Laravel documentation screenshot"
+                                        class="hidden aspect-video h-full w-full flex-1 rounded-[10px] object-top object-cover drop-shadow-[0px_4px_34px_rgba(0,0,0,0.25)] dark:block"
+                                    />
+                                    <div
+                                        class="absolute -bottom-16 -left-16 h-40 w-[calc(100%+8rem)] bg-gradient-to-b from-transparent via-white to-white dark:via-zinc-900 dark:to-zinc-900"
+                                    ></div>
+                                </div>
+
+                                <div class="relative flex items-center gap-6 lg:items-end">
+                                    <div id="docs-card-content" class="flex items-start gap-6 lg:flex-col">
+                                        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
+                                            <svg class="size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="#FF2D20" d="M23 4a1 1 0 0 0-1.447-.894L12.224 7.77a.5.5 0 0 1-.448 0L2.447 3.106A1 1 0 0 0 1 4v13.382a1.99 1.99 0 0 0 1.105 1.79l9.448 4.728c.14.065.293.1.447.1.154-.005.306-.04.447-.105l9.453-4.724a1.99 1.99 0 0 0 1.1-1.789V4ZM3 6.023a.25.25 0 0 1 .362-.223l7.5 3.75a.251.251 0 0 1 .138.223v11.2a.25.25 0 0 1-.362.224l-7.5-3.75a.25.25 0 0 1-.138-.22V6.023Zm18 11.2a.25.25 0 0 1-.138.224l-7.5 3.75a.249.249 0 0 1-.329-.099.249.249 0 0 1-.033-.12V9.772a.251.251 0 0 1 .138-.224l7.5-3.75a.25.25 0 0 1 .362.224v11.2Z"/><path fill="#FF2D20" d="m3.55 1.893 8 4.048a1.008 1.008 0 0 0 .9 0l8-4.048a1 1 0 0 0-.9-1.785l-7.322 3.706a.506.506 0 0 1-.452 0L4.454.108a1 1 0 0 0-.9 1.785H3.55Z"/></svg>
+                                        </div>
+
+                                        <div class="pt-3 sm:pt-5 lg:pt-0">
+                                            <h2 class="text-xl font-semibold text-black dark:text-white">Documentation</h2>
+
+                                            <p class="mt-4 text-sm/relaxed">
+                                                Laravel has wonderful documentation covering every aspect of the framework. Whether you are a newcomer or have prior experience with Laravel, we recommend reading our documentation from beginning to end.
+                                            </p>
+                                        </div>
+                                    </div>
+
+                                    <svg class="size-6 shrink-0 stroke-[#FF2D20]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"/></svg>
+                                </div>
+                            </a>
+
+                            <a
+                                href="https://laracasts.com"
+                                class="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
+                            >
+                                <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
+                                    <svg class="size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g fill="#FF2D20"><path d="M24 8.25a.5.5 0 0 0-.5-.5H.5a.5.5 0 0 0-.5.5v12a2.5 2.5 0 0 0 2.5 2.5h19a2.5 2.5 0 0 0 2.5-2.5v-12Zm-7.765 5.868a1.221 1.221 0 0 1 0 2.264l-6.626 2.776A1.153 1.153 0 0 1 8 18.123v-5.746a1.151 1.151 0 0 1 1.609-1.035l6.626 2.776ZM19.564 1.677a.25.25 0 0 0-.177-.427H15.6a.106.106 0 0 0-.072.03l-4.54 4.543a.25.25 0 0 0 .177.427h3.783c.027 0 .054-.01.073-.03l4.543-4.543ZM22.071 1.318a.047.047 0 0 0-.045.013l-4.492 4.492a.249.249 0 0 0 .038.385.25.25 0 0 0 .14.042h5.784a.5.5 0 0 0 .5-.5v-2a2.5 2.5 0 0 0-1.925-2.432ZM13.014 1.677a.25.25 0 0 0-.178-.427H9.101a.106.106 0 0 0-.073.03l-4.54 4.543a.25.25 0 0 0 .177.427H8.4a.106.106 0 0 0 .073-.03l4.54-4.543ZM6.513 1.677a.25.25 0 0 0-.177-.427H2.5A2.5 2.5 0 0 0 0 3.75v2a.5.5 0 0 0 .5.5h1.4a.106.106 0 0 0 .073-.03l4.54-4.543Z"/></g></svg>
+                                </div>
+
+                                <div class="pt-3 sm:pt-5">
+                                    <h2 class="text-xl font-semibold text-black dark:text-white">Laracasts</h2>
+
+                                    <p class="mt-4 text-sm/relaxed">
+                                        Laracasts offers thousands of video tutorials on Laravel, PHP, and JavaScript development. Check them out, see for yourself, and massively level up your development skills in the process.
+                                    </p>
+                                </div>
+
+                                <svg class="size-6 shrink-0 self-center stroke-[#FF2D20]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"/></svg>
+                            </a>
+
+                            <a
+                                href="https://laravel-news.com"
+                                class="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
+                            >
+                                <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
+                                    <svg class="size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g fill="#FF2D20"><path d="M8.75 4.5H5.5c-.69 0-1.25.56-1.25 1.25v4.75c0 .69.56 1.25 1.25 1.25h3.25c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25Z"/><path d="M24 10a3 3 0 0 0-3-3h-2V2.5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2V20a3.5 3.5 0 0 0 3.5 3.5h17A3.5 3.5 0 0 0 24 20V10ZM3.5 21.5A1.5 1.5 0 0 1 2 20V3a.5.5 0 0 1 .5-.5h14a.5.5 0 0 1 .5.5v17c0 .295.037.588.11.874a.5.5 0 0 1-.484.625L3.5 21.5ZM22 20a1.5 1.5 0 1 1-3 0V9.5a.5.5 0 0 1 .5-.5H21a1 1 0 0 1 1 1v10Z"/><path d="M12.751 6.047h2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-2A.75.75 0 0 1 12 7.3v-.5a.75.75 0 0 1 .751-.753ZM12.751 10.047h2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-2A.75.75 0 0 1 12 11.3v-.5a.75.75 0 0 1 .751-.753ZM4.751 14.047h10a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-10A.75.75 0 0 1 4 15.3v-.5a.75.75 0 0 1 .751-.753ZM4.75 18.047h7.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-7.5A.75.75 0 0 1 4 19.3v-.5a.75.75 0 0 1 .75-.753Z"/></g></svg>
+                                </div>
+
+                                <div class="pt-3 sm:pt-5">
+                                    <h2 class="text-xl font-semibold text-black dark:text-white">Laravel News</h2>
+
+                                    <p class="mt-4 text-sm/relaxed">
+                                        Laravel News is a community driven portal and newsletter aggregating all of the latest and most important news in the Laravel ecosystem, including new package releases and tutorials.
+                                    </p>
+                                </div>
+
+                                <svg class="size-6 shrink-0 self-center stroke-[#FF2D20]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"/></svg>
+                            </a>
+
+                            <div class="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800">
+                                <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
+                                    <svg class="size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
+                                        <g fill="#FF2D20">
+                                            <path
+                                                d="M16.597 12.635a.247.247 0 0 0-.08-.237 2.234 2.234 0 0 1-.769-1.68c.001-.195.03-.39.084-.578a.25.25 0 0 0-.09-.267 8.8 8.8 0 0 0-4.826-1.66.25.25 0 0 0-.268.181 2.5 2.5 0 0 1-2.4 1.824.045.045 0 0 0-.045.037 12.255 12.255 0 0 0-.093 3.86.251.251 0 0 0 .208.214c2.22.366 4.367 1.08 6.362 2.118a.252.252 0 0 0 .32-.079 10.09 10.09 0 0 0 1.597-3.733ZM13.616 17.968a.25.25 0 0 0-.063-.407A19.697 19.697 0 0 0 8.91 15.98a.25.25 0 0 0-.287.325c.151.455.334.898.548 1.328.437.827.981 1.594 1.619 2.28a.249.249 0 0 0 .32.044 29.13 29.13 0 0 0 2.506-1.99ZM6.303 14.105a.25.25 0 0 0 .265-.274 13.048 13.048 0 0 1 .205-4.045.062.062 0 0 0-.022-.07 2.5 2.5 0 0 1-.777-.982.25.25 0 0 0-.271-.149 11 11 0 0 0-5.6 2.815.255.255 0 0 0-.075.163c-.008.135-.02.27-.02.406.002.8.084 1.598.246 2.381a.25.25 0 0 0 .303.193 19.924 19.924 0 0 1 5.746-.438ZM9.228 20.914a.25.25 0 0 0 .1-.393 11.53 11.53 0 0 1-1.5-2.22 12.238 12.238 0 0 1-.91-2.465.248.248 0 0 0-.22-.187 18.876 18.876 0 0 0-5.69.33.249.249 0 0 0-.179.336c.838 2.142 2.272 4 4.132 5.353a.254.254 0 0 0 .15.048c1.41-.01 2.807-.282 4.117-.802ZM18.93 12.957l-.005-.008a.25.25 0 0 0-.268-.082 2.21 2.21 0 0 1-.41.081.25.25 0 0 0-.217.2c-.582 2.66-2.127 5.35-5.75 7.843a.248.248 0 0 0-.09.299.25.25 0 0 0 .065.091 28.703 28.703 0 0 0 2.662 2.12.246.246 0 0 0 .209.037c2.579-.701 4.85-2.242 6.456-4.378a.25.25 0 0 0 .048-.189 13.51 13.51 0 0 0-2.7-6.014ZM5.702 7.058a.254.254 0 0 0 .2-.165A2.488 2.488 0 0 1 7.98 5.245a.093.093 0 0 0 .078-.062 19.734 19.734 0 0 1 3.055-4.74.25.25 0 0 0-.21-.41 12.009 12.009 0 0 0-10.4 8.558.25.25 0 0 0 .373.281 12.912 12.912 0 0 1 4.826-1.814ZM10.773 22.052a.25.25 0 0 0-.28-.046c-.758.356-1.55.635-2.365.833a.25.25 0 0 0-.022.48c1.252.43 2.568.65 3.893.65.1 0 .2 0 .3-.008a.25.25 0 0 0 .147-.444c-.526-.424-1.1-.917-1.673-1.465ZM18.744 8.436a.249.249 0 0 0 .15.228 2.246 2.246 0 0 1 1.352 2.054c0 .337-.08.67-.23.972a.25.25 0 0 0 .042.28l.007.009a15.016 15.016 0 0 1 2.52 4.6.25.25 0 0 0 .37.132.25.25 0 0 0 .096-.114c.623-1.464.944-3.039.945-4.63a12.005 12.005 0 0 0-5.78-10.258.25.25 0 0 0-.373.274c.547 2.109.85 4.274.901 6.453ZM9.61 5.38a.25.25 0 0 0 .08.31c.34.24.616.561.8.935a.25.25 0 0 0 .3.127.631.631 0 0 1 .206-.034c2.054.078 4.036.772 5.69 1.991a.251.251 0 0 0 .267.024c.046-.024.093-.047.141-.067a.25.25 0 0 0 .151-.23A29.98 29.98 0 0 0 15.957.764a.25.25 0 0 0-.16-.164 11.924 11.924 0 0 0-2.21-.518.252.252 0 0 0-.215.076A22.456 22.456 0 0 0 9.61 5.38Z"
+                                            />
+                                        </g>
+                                    </svg>
+                                </div>
+
+                                <div class="pt-3 sm:pt-5">
+                                    <h2 class="text-xl font-semibold text-black dark:text-white">Vibrant Ecosystem</h2>
+
+                                    <p class="mt-4 text-sm/relaxed">
+                                        Laravel's robust library of first-party tools and libraries, such as <a href="https://forge.laravel.com" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white dark:focus-visible:ring-[#FF2D20]">Forge</a>, <a href="https://vapor.laravel.com" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Vapor</a>, <a href="https://nova.laravel.com" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Nova</a>, <a href="https://envoyer.io" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Envoyer</a>, and <a href="https://herd.laravel.com" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Herd</a> help you take your projects to the next level. Pair them with powerful open source libraries like <a href="https://laravel.com/docs/billing" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Cashier</a>, <a href="https://laravel.com/docs/dusk" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Dusk</a>, <a href="https://laravel.com/docs/broadcasting" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Echo</a>, <a href="https://laravel.com/docs/horizon" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Horizon</a>, <a href="https://laravel.com/docs/sanctum" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Sanctum</a>, <a href="https://laravel.com/docs/telescope" class="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white">Telescope</a>, and more.
+                                    </p>
+                                </div>
+                            </div>
+                        </div>
+                    </main>
+
+                    <footer class="py-16 text-center text-sm text-black dark:text-white/70">
+                        Laravel v{{ Illuminate\Foundation\Application::VERSION }} (PHP v{{ PHP_VERSION }})
+                    </footer>
+                </div>
+            </div>
+        </div>
+    </body>
+</html>
diff --git a/routes/console.php b/routes/console.php
new file mode 100644
index 0000000..eff2ed2
--- /dev/null
+++ b/routes/console.php
@@ -0,0 +1,8 @@
+<?php
+
+use Illuminate\Foundation\Inspiring;
+use Illuminate\Support\Facades\Artisan;
+
+Artisan::command('inspire', function () {
+    $this->comment(Inspiring::quote());
+})->purpose('Display an inspiring quote')->hourly();
diff --git a/routes/web.php b/routes/web.php
new file mode 100644
index 0000000..f842dd2
--- /dev/null
+++ b/routes/web.php
@@ -0,0 +1,8 @@
+<?php
+
+use Illuminate\Support\Facades\Route;
+use Inertia\Inertia;
+
+Route::get('/', function () {
+    return Inertia::render('Dashboard');
+});
diff --git a/tests/Backend/Feature/ExampleTest.php b/tests/Backend/Feature/ExampleTest.php
new file mode 100644
index 0000000..8364a84
--- /dev/null
+++ b/tests/Backend/Feature/ExampleTest.php
@@ -0,0 +1,19 @@
+<?php
+
+namespace Tests\Feature;
+
+// use Illuminate\Foundation\Testing\RefreshDatabase;
+use Tests\TestCase;
+
+class ExampleTest extends TestCase
+{
+    /**
+     * A basic test example.
+     */
+    public function test_the_application_returns_a_successful_response(): void
+    {
+        $response = $this->get('/');
+
+        $response->assertStatus(200);
+    }
+}
diff --git a/tests/Backend/Unit/ExampleTest.php b/tests/Backend/Unit/ExampleTest.php
new file mode 100644
index 0000000..5773b0c
--- /dev/null
+++ b/tests/Backend/Unit/ExampleTest.php
@@ -0,0 +1,16 @@
+<?php
+
+namespace Tests\Unit;
+
+use PHPUnit\Framework\TestCase;
+
+class ExampleTest extends TestCase
+{
+    /**
+     * A basic test example.
+     */
+    public function test_that_true_is_true(): void
+    {
+        $this->assertTrue(true);
+    }
+}
diff --git a/tests/Pest.php b/tests/Pest.php
new file mode 100644
index 0000000..b68fd7c
--- /dev/null
+++ b/tests/Pest.php
@@ -0,0 +1,48 @@
+<?php
+
+/*
+|--------------------------------------------------------------------------
+| Test Case
+|--------------------------------------------------------------------------
+|
+| The closure you provide to your test functions is always bound to a specific PHPUnit test
+| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
+| need to change it using the "uses()" function to bind a different classes or traits.
+|
+*/
+
+uses(
+    Tests\TestCase::class,
+    Illuminate\Foundation\Testing\RefreshDatabase::class,
+)->in('Backend');
+
+/*
+|--------------------------------------------------------------------------
+| Expectations
+|--------------------------------------------------------------------------
+|
+| When you're writing tests, you often need to check that values meet certain conditions. The
+| "expect()" function gives you access to a set of "expectations" methods that you can use
+| to assert different things. With these methods, you can check any value or object.
+|
+*/
+
+expect()->extend('toBeOne', function () {
+    return $this->toBe(1);
+});
+
+/*
+|--------------------------------------------------------------------------
+| Functions
+|--------------------------------------------------------------------------
+|
+| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
+| project that you don't want to repeat in every file. Here you can also expose helpers as
+| global functions to help you with your tests.
+|
+*/
+
+function something()
+{
+    // ..
+}
diff --git a/tests/TestCase.php b/tests/TestCase.php
new file mode 100644
index 0000000..fe1ffc2
--- /dev/null
+++ b/tests/TestCase.php
@@ -0,0 +1,10 @@
+<?php
+
+namespace Tests;
+
+use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
+
+abstract class TestCase extends BaseTestCase
+{
+    //
+}
diff --git a/vite.config.js b/vite.config.js
new file mode 100644
index 0000000..19f2908
--- /dev/null
+++ b/vite.config.js
@@ -0,0 +1,13 @@
+import { defineConfig } from 'vite';
+import laravel from 'laravel-vite-plugin';
+import react from '@vitejs/plugin-react';
+
+export default defineConfig({
+    plugins: [
+        laravel({
+            input: 'resources/js/app.jsx',
+            refresh: true,
+        }),
+        react(),
+    ],
+});


