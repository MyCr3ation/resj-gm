# Google OAuth Setup Instructions

To complete the Google OAuth integration, follow these steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google OAuth API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google OAuth2"
   - Enable the API

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add your application name

5. Configure OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the required information
   - Add your email in "Test users" if in testing mode

6. Configure authorized origins:
   - In the OAuth 2.0 client configuration
   - Add your development URL (e.g., http://localhost:5173)
   - Add your production URL when deploying

7. Configure authorized redirect URIs:
   - Add your development redirect URI (e.g., http://localhost:5173/auth/callback)
   - Add your production redirect URI when deploying

8. Get your Client ID:
   - Copy the generated Client ID
   - Replace `YOUR_GOOGLE_CLIENT_ID` in `src/main.jsx` with your actual Client ID

## Implementation Details

The Google Sign-In integration has been added to both the Login and SignUp components. When users click the "Continue with Google" button:

1. They will see the Google sign-in popup
2. Upon successful authentication:
   - A success message will be shown
   - They will be redirected to the dashboard
3. If there's an error:
   - An error message will be displayed
   - The error will be logged to the console

## Security Considerations

- Never commit your actual Google Client ID to version control
- Use environment variables in production
- Regularly rotate credentials
- Monitor OAuth usage in Google Cloud Console
- Implement proper CSRF protection
- Validate OAuth tokens on your backend