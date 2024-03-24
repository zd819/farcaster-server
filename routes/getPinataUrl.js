import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();
import 'dotenv/config';

// Environment variables for API keys and base URLs
const KARMA3LABS_API_URL = process.env.KARMA3LABS_API_URL;


// Assuming your PINATA_JWT is stored in environment variables
const pinataJWT = process.env.PINATA_JWT;


router.get('/keys', async (req, res) => {
  try {
    const uuidKeyName = uuid();
    const body = JSON.stringify({
      keyName: uuidKeyName,
      permissions: {
        endpoints: {
          pinning: {
            pinFileToIPFS: true,
            pinJSONToIPFS: true,
          },
        },
      },
      maxUses: 2,
    });

    const keyRes = await fetch("https://api.pinata.cloud/users/generateApiKey", {
      method: "POST",
      body: body,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${pinataJWT}`,
      },
    });

    const keyResJson = await keyRes.json();
    res.status(200).json({
      pinata_api_key: keyResJson.pinata_api_key,
      JWT: keyResJson.JWT,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "Error creating API Key:" });
  }
});

router.put('/keys-destroy', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const keyData = JSON.stringify({ apiKey });

    const keyDeleteRes = await fetch("https://api.pinata.cloud/users/revokeApiKey", {
      method: "PUT",
      body: keyData,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${pinataJWT}`,
      },
    });

    const keyDeleteJson = await keyDeleteRes.json();
    res.status(200).json(keyDeleteJson);

  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "Error Deleting API Key:" });
  }
});


module.exports = router;