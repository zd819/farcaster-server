const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Environment variables for API keys and base URLs
const KARMA3LABS_API_URL = process.env.KARMA3LABS_API_URL;
const PINATA_API_URL = process.env.PINATA_API_URL;
const PINATA_API_KEY = process.env.PINATA_API_KEY;

// Route to load frames based on user's wallet address
router.post('/load-frames', async (req, res) => {
    try {
        const walletAddress = req.body.walletAddress;
        // Fetch engagement and following FIDs from Karma3Labs API
        const engagedFIDs = await fetchNeighbors(walletAddress, '/graph/neighbors/engagement/addresses');
        const followingFIDs = await fetchNeighbors(walletAddress, '/graph/neighbors/following/addresses');

        // Combine and deduplicate the FIDs
        const allFIDs = [...new Set([...engagedFIDs, ...followingFIDs])];

        // Fetch casts for each FID
        const allCastsPromises = allFIDs.map(fid => fetchCastsByFID(fid));
        const allCastsResults = await Promise.all(allCastsPromises);
        const allCasts = allCastsResults.flat(); // Flatten the array of arrays

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

// Function to fetch casts by FID from Pinata API
async function fetchCastsByFID(fid) {
    const response = await fetch(`${PINATA_API_URL}/casts?fid=${fid}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PINATA_API_KEY}`
        },
    });
    const data = await response.json();
    return data.casts; // Assuming the response contains a 'casts' array
}

module.exports = router;
