import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();
import 'dotenv/config';
// import { get_preference } from '../functions/get_preference';
// import userFrames from '../functions/all-casts.js';

// A mock "database" to store user preferences and sorted frames for the purpose of this example
let mockDatabase = {
  userPreferences: {}, // Stores user preferences
  userSortedFrames: {} // Stores sorted frames for users
};

// Function to simulate storing the sorted frames and preferences in the "database"
function storeUserPreference(userId, preferenceOutput, sortedFrames) {
  mockDatabase.userPreferences[userId] = preferenceOutput;
  mockDatabase.userSortedFrames[userId] = sortedFrames;
}

// Function to simulate retrieving the stored sorted frames for a user
function getUserSortedFrames(userId) {
  return mockDatabase.userSortedFrames[userId] || [];
}

// POST endpoint to receive sorting preference and return sorted frames
router.post('/personalize-feed', async function(req, res) {
  const { userId, preference } = req.body; // Expecting a userId to associate the preference
  let sortedFrames = [];
  // Retrieve the value from the global object
  const userFrames = global.userFrames;

  // FOR TESTING DISABLE :
  // LLM processing to determine the sorting method
// const AI_preference = await get_preference(preference);
  
  // BASED ON THE PYDANTIC OUTPUT PREFERNCE, ORDER FEED 
  // For now, let's assume 'timestamp' is the method specified in the 'preference'
  if (preference === 'timestamp') {
    sortedFrames = userFrames.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
  // TODO: Add other sorting methods based on the preference

  // Store the sorted frames in a mock "database" for the user
  storeUserPreference(userId, preference, sortedFrames);

  // 1. Return the ordered frames back to the frontend
  res.json({preference_output:sortedFrames});
});

// GET endpoint to retrieve the sorted frames for a user
router.get('/user-frames/:userId', function(req, res) {
  const userId = req.params.userId;

  // Retrieve the stored sorted frames for the user from the mock "database"
  const sortedFrames = getUserSortedFrames(userId);

  // Return the ordered frames preferences for that user
  res.json(sortedFrames);
});

  



export default router;
