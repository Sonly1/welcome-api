const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Define your base API endpoint for job actions
const baseUrl = 'https://{{endpoint}}/api/jobs';

// Define the headers for your request
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Token {{token_key}}' // Replace YOUR_AUTH_TOKEN with your actual token
};

// Path to your CSV file containing job IDs
const filePath = '/users/User_name/Downloads/file_name.csv'; // Update with the actual path to your CSV

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
      "jobId": jobId, // The value will pull from the const 
      "attributeId": "{{attribute_id}}", // Replace with your actual attribute ID
      "values": [{
        "id": "((value_id}}", // Replace with your actual value ID
        "label": "{{value_name}}" // Replace with the label of your value
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

