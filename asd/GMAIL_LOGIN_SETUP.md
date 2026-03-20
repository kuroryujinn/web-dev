# Gmail Login Setup Guide

The ASD Quiz App now supports Gmail/Google authentication in addition to the simple name + avatar login.

## How to Enable Gmail Login

### Step 1: Create a Google OAuth Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "ASD Quiz App") and click Create

### Step 2: Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. If prompted, click "Configure OAuth Consent Screen" first:
   - Choose "External" user type
   - Fill in required fields (App name, User support email, etc.)
   - Skip optional scopes
   - Add test users if needed
   - Save and continue

4. Back to creating the Client ID:
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:5174`
   - Click Create

### Step 4: Copy Your Client ID
1. You'll see your OAuth 2.0 Client ID displayed
2. Copy the **Client ID** (not the Client Secret)

### Step 5: Configure Your App
1. Open `.env.local` in your project root
2. Replace `your_google_client_id_here` with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
   ```
3. Save the file

### Step 6: Restart the Dev Server
1. Stop the running dev server (Ctrl+C)
2. Run `npm run dev` again
3. The Google login button should now appear on the login page

## How It Works

- Users can now click the "Sign in with Google" button on the login page
- Their Google profile name and picture will be used in the quiz
- Their email address is also stored (for future features)
- Login data is stored in browser localStorage, same as the simple login

## For Production

When deploying to production:
1. Add your production domain to the Authorized JavaScript origins in Google Cloud Console
2. Update the Client ID in your production `.env` file
3. Never commit sensitive credentials to version control

## Troubleshooting

- **"Google login will not work" warning**: Make sure `VITE_GOOGLE_CLIENT_ID` is set in `.env.local`
- **Google button not showing**: Verify the Client ID is correct and the domain is in authorized origins
- **Login fails silently**: Check browser console (F12 > Console tab) for error messages
