import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();
import 'dotenv/config';


// Route to load frames based on user's wallet address
app.post('/api/frame/personalize-feed', (req, res) => {
    const userPreference = req.body.preference_text;
  
    // Serialize the input data so it can be passed to Python
    const serializedData = JSON.stringify({ preference_text: userPreference });
  
    // Spawn a Python subprocess to run your Pydantic and LLM code
    const pythonProcess = spawn('python', ['path_to_your_python_script.py', serializedData]);
  
    // Collect data from the Python script
    let pythonData = '';
    pythonProcess.stdout.on('data', (data) => {
      pythonData += data.toString();
    });
  
    // When the Python script finishes, send the response back to the client
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Failed to process preference' });
      }
      const pythonResponse = JSON.parse(pythonData);
      res.status(200).json(pythonResponse);
    });
  });
  



export default router;
