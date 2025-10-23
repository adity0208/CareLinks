# CareLinks Cloud Functions

This directory contains Firebase Cloud Functions for the CareLinks application.

## Functions

### `healthCheck`
- **Type**: HTTP Request
- **Purpose**: Health check endpoint for monitoring
- **URL**: `https://your-region-your-project.cloudfunctions.net/healthCheck`

### `processPatientData`
- **Type**: Callable Function
- **Purpose**: Process patient data with AI insights (placeholder)
- **Usage**: Call from frontend using Firebase SDK

### `onPatientCreated`
- **Type**: Firestore Trigger
- **Purpose**: Triggered when a new patient document is created
- **Collection**: `patients/{patientId}`

## Development

1. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

2. Start local emulator:
   ```bash
   firebase emulators:start --only functions
   ```

3. Deploy functions:
   ```bash
   firebase deploy --only functions
   ```

## Environment Variables

Functions will automatically have access to the same Firebase project configuration. For additional API keys (like Gemini), configure them using:

```bash
firebase functions:config:set gemini.api_key="your_key_here"
```

## Future Enhancements

- AI-powered health insights using Gemini API
- Automated appointment reminders
- Disease outbreak detection algorithms
- Patient data analytics and reporting