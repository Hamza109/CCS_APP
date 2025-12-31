# Environment Variables Setup Guide

## Encryption Key Configuration

The app now uses environment variables for the encryption key. Follow these steps to set it up:

## Step 1: Create .env File

Create a `.env` file in the root directory of the project:

```bash
# In the project root directory
touch .env
```

## Step 2: Generate Encryption Key

You can generate a random encryption key using the provided script:

```bash
node scripts/generate-encryption-key.js
```

This will output a random 32-character key. Copy the key.

Alternatively, generate a key manually:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64').substring(0, 32))"
```

## Step 3: Add Key to .env File

Open the `.env` file and add:

```env
# Encryption Key for AES-256-CBC
# This key must be exactly 32 characters for AES-256
# IMPORTANT: Keep this key secret and never commit it to version control
# This key must match the key in your Laravel backend (.env file)
ENCRYPTION_KEY=your-generated-key-here
```

**Example:**

```env
ENCRYPTION_KEY=dEAIYLf5Z7JvYn3PVIKFVBGubh/S+EfN
```

## Step 4: Update Laravel Backend

Make sure your Laravel backend `.env` file has the **same** encryption key:

```env
APP_ENCRYPTION_KEY=dEAIYLf5Z7JvYn3PVIKFVBGubh/S+EfN
```

## Step 5: Restart Development Server

After creating/updating the `.env` file, restart your Expo development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
# or
expo start
```

## Verification

The encryption key is loaded from:

1. `.env` file → `app.config.js` → `expo-constants` → `encryption.ts`
2. If `.env` is not found, it falls back to secure storage
3. If secure storage is empty, it uses a default (with warning)

## Important Notes

1. **Never commit `.env` to version control** - It's already in `.gitignore`
2. **Use the same key in Laravel** - The key must match between mobile app and backend
3. **Generate a new key for production** - Don't use the example key
4. **Keep keys secure** - Treat encryption keys as sensitive credentials

## Troubleshooting

### Key Not Found Warning

If you see a warning about the encryption key not being found:

1. Check that `.env` file exists in the project root
2. Verify `ENCRYPTION_KEY` is set in `.env`
3. Restart the Expo development server
4. Clear cache: `expo start --clear`

### Key Length Error

The encryption key must be exactly 32 characters. If you get a length error:

1. Regenerate the key using the script
2. Ensure no extra spaces or newlines in `.env`
3. Verify the key is on a single line

### Key Mismatch with Laravel

If decryption fails on the backend:

1. Verify both `.env` files have the same key
2. Check for whitespace or encoding issues
3. Ensure the key is exactly 32 characters in both places

## Example .env File

```env
# Encryption Key for AES-256-CBC
ENCRYPTION_KEY=dEAIYLf5Z7JvYn3PVIKFVBGubh/S+EfN
```

## Security Best Practices

- ✅ Use different keys for development and production
- ✅ Rotate keys periodically
- ✅ Store keys securely (use environment variables)
- ✅ Never log or expose keys in code
- ✅ Use a key management service for production
