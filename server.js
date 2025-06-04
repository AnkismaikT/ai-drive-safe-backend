require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Driving data endpoint
app.post('/api/driving-data', async (req, res) => {
  try {
    const { userId, data } = req.body;
    
    // Store driving data in Firebase
    const db = admin.firestore();
    await db.collection('drivingData').add({
      userId,
      data,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error storing driving data:', error);
    res.status(500).json({ error: 'Failed to store driving data' });
  }
});

// Get user driving history
app.get('/api/driving-history/:userId', async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = req.params.userId;
    
    const snapshot = await db.collection('drivingData')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching driving history:', error);
    res.status(500).json({ error: 'Failed to fetch driving history' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
