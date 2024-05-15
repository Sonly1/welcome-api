const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Define your base API endpoint for job actions
const baseUrl = 'https://api.parsable.net/api/jobs';

// Define the headers for your request
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTE3Mjc2OTcsImlhdCI6MTcwOTEzNTY5NywiaXNzIjoiYXV0aDpwcm9kdWN0aW9uIiwic2VyYTpzaWQiOiIxY2RlZDI3My00OTljLTQ4MGQtOGIyOC1mY2VlM2Q4YmQ2OGEiLCJzZXJhOnRlYW1JZCI6IjRmOGIwYzgyLWNlOTgtNDQ0OC1iNTE3LTg0NmY1YjRhZWQ1MyIsInNlcmE6dHlwIjoiYXV0aCIsInN1YiI6IjY4MWUwZDE4LTBhNWQtNGFkYS05NmFiLWZjNDIxOGY0MjQ2NCJ9.qhg77TciXcg4vkFtTjDzcC4iEaAR6CLieHGGTOyKLLY' // Replace YOUR_AUTH_TOKEN with your actual token
};

// Path to your CSV file containing job IDs
const filePath = '/users/ramy.kader/Downloads/job_ids.csv'; // Update with the actual path to your CSV

// Creating a readable stream and interface to read file line by line
const readInterface = readline.createInterface({
  input: fs.createReadStream(filePath),
  console: false
});

// Function to make API call to update attribute
const updateAttribute = async (jobId) => {
  const payload = {
    "method": "updateAttributeRestricted",
    "arguments": {
      "jobId": jobId,
      "attributeId": "63ced756-3a6d-41af-bdc3-1b463ba4eaee", // Replace with your actual attribute ID
      "values": [{
        "id": "98c3b022-5e8c-49bf-9a7d-8d0a709b1c34", // Replace with your actual value ID
        "label": "France" // Replace with the label of your value
      }],
      "behave": "MERGE"
    }
  };

  try {
    const response = await axios.post(baseUrl, payload, { headers });
    console.log(`Request successful: The attribute value was successfully added to job ${jobId}.`);
  } catch (error) {
    console.error(`Failed to update job ${jobId}. Error: ${error.response ? JSON.stringify(error.response.data, null, 2) : error.message}`);
  }
};

// Reading lines from the file and calling updateAttribute for each jobId
readInterface.on('line', (line) => {
  const jobId = line.trim(); // Assuming each line in your CSV contains one jobId
  updateAttribute(jobId);
});

