import { Frog, Button } from 'frog';

// Initialize a new Frog application
const app = new Frog();

// A mock "database" to store frame layouts
const frameDatabase = {};

// Define a frame route that creates a frame from the frontend editor state
app.frame('/create-frame', (c) => {
  // Extract the frame layout from the request body
  const { layout } = c.req.body;

  // Generate a unique frame ID and store the layout in the "database"
  const frameId = Math.random().toString(36).substring(2, 15); // You should use a more robust method for ID generation
  frameDatabase[frameId] = layout;

  // Construct the URL to access the individual frame
  const frameUrl = `${c.req.protocol}://${c.req.get('host')}/frames/${frameId}`;

  // Respond with the URL of the newly created frame
  return c.res({ status: 200, body: { frameUrl } });
});

// Define a route to serve a frame based on its ID
app.frame('/frames/:frameId', (c) => {
  // Retrieve the frame ID from the URL
  const { frameId } = c.req.params;

  // Look up the frame layout in the "database"
  const layout = frameDatabase[frameId];

  if (!layout) {
    // If the layout doesn't exist, return a 404 response
    return c.res({ status: 404, body: 'Frame not found' });
  }

  // Use the layout data to construct the frame's elements
  const elements = layout.map((item) => {
    switch (item.type) {
      case 'button':
        return <Button value={item.value}>{item.text}</Button>;
      case 'image':
        return <img src={item.imageUrl} alt={item.altText} />;
      default:
        return null; // Handle other element types or throw an error
    }
  });

  // Respond with the frame content
  return c.res({
    body: (
      <div>
        {elements}
      </div>
    ),
  });
});

// Export the Frog application for use in the entry point of the backend
export default app;
