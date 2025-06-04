# AI Drive Safe Backend

This is the backend API for the AI Drive Safe mobile application.

## Features

- Firebase Authentication integration
- Driving data storage and retrieval
- Location tracking
- Incident reporting

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with the following variables:
```
PORT=3000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

3. Start the server:
```bash
npm start
```

## API Endpoints

- `GET /api/health` - Check server health
- `POST /api/driving-data` - Store driving data
- `GET /api/driving-history/:userId` - Get user driving history
