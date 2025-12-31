# Laravel Backend - AES Decryption Guide

This guide explains how to decrypt AES-encrypted payloads from the React Native mobile app in your Laravel backend.

## Overview

The mobile app encrypts all POST request payloads using **AES-256-CBC** encryption before sending them to the backend. The encrypted data is sent in the following format:

```json
{
  "encrypted": "iv:encryptedData"
}
```

Where:

- `iv` is the Base64-encoded Initialization Vector (16 bytes)
- `encryptedData` is the Base64-encoded encrypted payload

## Encryption Details

- **Algorithm**: AES-256-CBC
- **Key Size**: 256 bits (32 characters)
- **IV Size**: 128 bits (16 bytes)
- **Padding**: PKCS7
- **Key**: Must match the key in the mobile app (stored in `src/utils/encryption.ts`)

## Laravel Implementation

### Step 1: Install Required Package

Laravel has built-in encryption support, but for AES-256-CBC with custom IV, you'll need to use OpenSSL directly or a package:

```bash
# No additional package needed - Laravel uses OpenSSL which supports AES-256-CBC
```

### Step 2: Create Decryption Middleware

Create a middleware to automatically decrypt incoming POST requests:

```bash
php artisan make:middleware DecryptRequest
```

### Step 3: Implement Decryption Logic

Update `app/Http/Middleware/DecryptRequest.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class DecryptRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Only decrypt POST requests
        if ($request->isMethod('post') && $request->has('encrypted')) {
            try {
                $encryptedData = $request->input('encrypted');

                // Decrypt the payload
                $decryptedData = $this->decrypt($encryptedData);

                // Replace request data with decrypted data
                $request->merge($decryptedData);

                // Remove the encrypted field
                $request->request->remove('encrypted');

            } catch (Exception $e) {
                Log::error('Decryption failed: ' . $e->getMessage());

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid encrypted payload',
                    'error' => 'Decryption failed'
                ], 400);
            }
        }

        return $next($request);
    }

    /**
     * Decrypt AES-256-CBC encrypted data
     *
     * @param string $encryptedData Format: "iv:encryptedData" (both base64)
     * @return array Decrypted data as array
     */
    private function decrypt(string $encryptedData): array
    {
        // Split IV and encrypted data
        $parts = explode(':', $encryptedData);

        if (count($parts) !== 2) {
            throw new Exception('Invalid encrypted data format');
        }

        [$ivBase64, $encryptedBase64] = $parts;

        // Decode from Base64
        $iv = base64_decode($ivBase64, true);
        $encrypted = base64_decode($encryptedBase64, true);

        if ($iv === false || $encrypted === false) {
            throw new Exception('Invalid Base64 encoding');
        }

        // Get encryption key from config (should match mobile app key)
        $key = config('app.encryption_key');

        if (empty($key)) {
            throw new Exception('Encryption key not configured');
        }

        // Ensure key is 32 bytes (256 bits) for AES-256
        $key = substr(hash('sha256', $key), 0, 32);

        // Decrypt using AES-256-CBC
        $decrypted = openssl_decrypt(
            $encrypted,
            'AES-256-CBC',
            $key,
            OPENSSL_RAW_DATA,
            $iv
        );

        if ($decrypted === false) {
            throw new Exception('Decryption failed: ' . openssl_error_string());
        }

        // Decode JSON
        $data = json_decode($decrypted, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON in decrypted data: ' . json_last_error_msg());
        }

        return $data;
    }
}
```

### Step 4: Register Middleware

Add the middleware to `app/Http/Kernel.php`:

```php
protected $middlewareGroups = [
    'web' => [
        // ... existing middleware
    ],

    'api' => [
        // ... existing middleware
        \App\Http\Middleware\DecryptRequest::class,
    ],
];
```

Or apply it to specific routes in `routes/api.php`:

```php
Route::middleware(['decrypt'])->group(function () {
    Route::post('/api/complaints', [ComplaintController::class, 'store']);
    Route::post('/api/contacts', [ContactController::class, 'store']);
    Route::post('/api/otp/send', [OtpController::class, 'send']);
    Route::post('/api/otp/verify', [OtpController::class, 'verify']);
    // ... other POST routes
});
```

### Step 5: Configure Encryption Key

Add the encryption key to your `.env` file:

```env
APP_ENCRYPTION_KEY=your-32-character-secret-key-here
```

**Important**: This key must match the key in the mobile app (`src/utils/encryption.ts`).

Add to `config/app.php`:

```php
'encryption_key' => env('APP_ENCRYPTION_KEY', 'your-default-key-here'),
```

### Step 6: Optional - Create Helper Function

You can also create a helper function for manual decryption if needed:

```php
// app/Helpers/EncryptionHelper.php
<?php

if (!function_exists('decrypt_mobile_payload')) {
    function decrypt_mobile_payload(string $encryptedData): array
    {
        $parts = explode(':', $encryptedData);

        if (count($parts) !== 2) {
            throw new Exception('Invalid encrypted data format');
        }

        [$ivBase64, $encryptedBase64] = $parts;
        $iv = base64_decode($ivBase64, true);
        $encrypted = base64_decode($encryptedBase64, true);

        if ($iv === false || $encrypted === false) {
            throw new Exception('Invalid Base64 encoding');
        }

        $key = substr(hash('sha256', config('app.encryption_key')), 0, 32);

        $decrypted = openssl_decrypt(
            $encrypted,
            'AES-256-CBC',
            $key,
            OPENSSL_RAW_DATA,
            $iv
        );

        if ($decrypted === false) {
            throw new Exception('Decryption failed');
        }

        return json_decode($decrypted, true);
    }
}
```

## Testing

### Test Decryption

Create a test route to verify decryption works:

```php
// routes/api.php
Route::post('/test-decrypt', function (Request $request) {
    try {
        $encrypted = $request->input('encrypted');
        $decrypted = decrypt_mobile_payload($encrypted);

        return response()->json([
            'success' => true,
            'decrypted' => $decrypted
        ]);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 400);
    }
});
```

### Manual Testing with cURL

```bash
# First, get encrypted payload from mobile app logs
# Then test decryption:
curl -X POST http://your-api-url/api/test-decrypt \
  -H "Content-Type: application/json" \
  -d '{"encrypted": "iv:encryptedData"}'
```

## Security Best Practices

1. **Key Management**:

   - Store encryption key in `.env` file (never commit to version control)
   - Use different keys for development and production
   - Rotate keys periodically

2. **Error Handling**:

   - Don't expose detailed error messages in production
   - Log decryption failures for monitoring
   - Return generic error messages to clients

3. **Performance**:

   - Middleware adds minimal overhead
   - Consider caching decrypted data if needed
   - Monitor decryption performance

4. **Key Exchange**:
   - Consider implementing a key exchange mechanism
   - Use HTTPS for all API communication
   - Implement key rotation strategy

## Troubleshooting

### Common Issues

1. **"Invalid encrypted data format"**

   - Check that payload contains `encrypted` field
   - Verify format is `iv:encryptedData`

2. **"Decryption failed"**

   - Verify encryption key matches mobile app
   - Check that key is exactly 32 characters
   - Ensure IV and encrypted data are valid Base64

3. **"Invalid JSON in decrypted data"**
   - Mobile app may have sent invalid JSON
   - Check mobile app encryption implementation

### Debug Mode

Enable detailed logging in middleware for debugging:

```php
Log::debug('Encrypted data received', [
    'length' => strlen($encryptedData),
    'has_iv' => strpos($encryptedData, ':') !== false
]);
```

## Example Controller Usage

After decryption middleware, controllers receive decrypted data normally:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        // Data is already decrypted by middleware
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'mobile_no' => 'required|string',
            // ... other fields
        ]);

        // Process normally
        $complaint = Complaint::create($validated);

        return response()->json([
            'success' => true,
            'data' => $complaint
        ]);
    }
}
```

## Key Synchronization

**Important**: The encryption key in the mobile app (`.env` file) must match the key in Laravel (`.env` file).

### Mobile App Setup

The mobile app now reads the encryption key from `.env` file:

1. Create `.env` file in the project root
2. Add: `ENCRYPTION_KEY=your-32-character-key-here`
3. The key is loaded via `app.config.js` → `expo-constants` → `encryption.ts`

Generate a key using:

```bash
node scripts/generate-encryption-key.js
```

### Laravel Setup

Add the same key to Laravel `.env`:

```env
APP_ENCRYPTION_KEY=your-32-character-key-here
```

**Both keys must be identical!**

For production, use a strong, randomly generated 32-character key. See `ENV_SETUP.md` for detailed instructions.
