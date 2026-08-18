# Google OAuth2 Setup Guide

This guide will help you set up Google Sign-In for your portfolio.

## Steps to Configure Google OAuth

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "Portfolio App")
5. Click "CREATE"

### 2. Enable Google+ API
1. In the Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press **ENABLE**

### 3. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. You might need to configure the OAuth consent screen first:
   - Click **CONFIGURE CONSENT SCREEN**
   - Select **External** (for testing)
   - Fill in required fields (App name, Support email, etc.)
   - Click **SAVE AND CONTINUE**
   - Skip optional scopes and save
   - Go back to **Credentials**

4. Now create OAuth client ID:
   - Application type: **Web application**
   - Name: "Portfolio Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `http://localhost:5175` (if using different port)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google` (backend)
     - `http://localhost:5173` (frontend)
   - Click **CREATE**

5. Copy your **Client ID** from the popup

### 4. Configure Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

#### Backend (.env)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/portfolioDB
PORT=5000
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
JWT_SECRET=your_secret_key_change_in_production
```

### 5. Restart Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 6. Test Google Sign-In
1. Open your portfolio in browser
2. Click "Sign In" button in navbar
3. Click "Sign in with Google"
4. Follow Google's authentication flow
5. You should be logged in!

## Features After Setup

✅ **Sign-in with Google** - Users can authenticate using their Google account
✅ **User Profile** - Display user's name and profile picture
✅ **JWT Authentication** - Secure token-based authentication
✅ **User Database** - Stores user information in MongoDB
✅ **Login/Logout** - Easy sign out functionality

## Troubleshooting

### "Invalid Client ID" Error
- Make sure you copied the correct Client ID
- Check that localhost:5173/5175 is in authorized origins

### CORS Errors
- Ensure `CLIENT_URL` in backend .env is correct
- Check CORS configuration in `backend/server.js`

### "Token Invalid" Error
- Verify Google Client ID is correct in both frontend and backend
- Ensure `GOOGLE_CLIENT_ID` environment variable is set
- Check that token hasn't expired

## Production Deployment

For production:
1. Use your actual domain instead of localhost
2. Change `JWT_SECRET` to a strong random string
3. Update Google OAuth credentials with production URLs
4. Set `NODE_ENV=production`
5. Use HTTPS for all URLs

## Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React Google OAuth Library](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)
