const express = require('express');
const router = express.Router();
const uuid = require('uuid'); // Make sure to install this package

// Mock database to store frame data
const frameDatabase = {};

router.post('/create-frame', (req, res) => {
    const frameId = uuid.v4();
    const frameData = req.body; // This would be your frame layout data from the frontend

    // Store the frame data in your "database"
    frameDatabase[frameId] = frameData;

    // Generate a public URL for the frame
    const frameUrl = `${req.protocol}://${req.get('host')}/frame/${frameId}`;

    // Respond with the URL of the newly created frame
    res.json({ frameUrl });
});

router.get('/:frameId', (req, res) => {
    const frameId = req.params.frameId;
    const frameData = frameDatabase[frameId];

    if (!frameData) {
        return res.status(404).send('Frame not found');
    }

    // Here you would render the frame using the stored data
    // For this example, we are assuming frameData contains an imageURL.
    res.send(`<html><body><img src="${frameData.imageURL}" /></body></html>`);
});

module.exports = router;
