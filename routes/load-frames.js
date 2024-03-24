import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();
import 'dotenv/config';
// import userFrames from '../functions/all-casts.js';

// Environment variables for API keys and base URLs
const KARMA3LABS_API_URL = process.env.KARMA3LABS_API_URL;
const PINATA_API_URL = process.env.PINATA_API_URL;
const PINATA_API_KEY = process.env.PINATA_API_KEY;

// Route to load frames based on user's wallet address
router.post('/load-frames', async (req, res) => {
    try {
        // const walletAddress = req.body.walletAddress;
        //Testing purposes:
        const walletAddress = "0x4114e33eb831858649ea3702e1c9a2db3f626446";

        // Vitalik FID for testing 
        const fiDtest= '5650';

        // Fetch engagement and following FIDs from Karma3Labs API
        const engagedFIDs = await fetchNeighbors(fiDtest, '/graph/neighbors/engagement/fids');
        const followingFIDs = await fetchNeighbors(fiDtest, '/graph/neighbors/following/fids');

        // Extract 'fid' values from 'engagedFIDs.result' and 'followingFIDs.result'
        const engagedFIDsArray = engagedFIDs.result.map(account => account.fid);
        const followingFIDsArray = followingFIDs.result.map(account => account.fid);

        // Combine and deduplicate the FIDs
        const allFIDs = [...new Set([...engagedFIDsArray, ...followingFIDsArray])];
        // Convert the set back into an array and take only the first 10 items
        const limitedFIDs = Array.from(allFIDs).slice(0, 4);
        // Fetch casts for each FID
        const allCastsPromises = limitedFIDs.map(fid => fetchCastsByFID(fid));
        const allCastsResults = await Promise.all(allCastsPromises);

        const allCasts = allCastsResults.flat(); // Flatten the array of arrays
        // const allCasts = allFIDs.flat(); // Flatten the array of arrays
        // Retrieve the value from the global object
        // update-frames.js
        global.userFrames = [
            allCasts
        ];
        // Return the combined casts to the client
        res.json(allCasts);
    } catch (error) {
        console.error('Error loading frames:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Function to fetch neighbors from Karma3Labs API
async function fetchNeighbors(walletAddress, endpoint) {
    const response = await fetch(`${KARMA3LABS_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify([walletAddress]),
    });
    const data = await response.json();
    return data; // Assuming the response is an array of FIDs
}

async function fetchCastsByFID(fid) {
    try {
        const response = await fetch(`${PINATA_API_URL}/casts?fid=${fid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PINATA_API_KEY}`
            },
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data.data.casts; // Ensure this matches the actual structure of your response
    } catch (error) {
        console.error(`Error fetching casts for fid ${fid}:`, error);
        return []; // Return an empty array or handle the error as appropriate
    }
}



export default router;
