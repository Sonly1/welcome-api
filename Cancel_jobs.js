const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Define your base API endpoint
const baseUrl = 'https://{{endpoint}}/api/v3/teams/'; // MOdify the gateway API call endpoint based on the server's location 

// Define the teamId
const teamId = '{{team_id}}';

// Define the headers for your request
const headers = {
  'accept': '*/*',
  'parsable-custom-touchstone': 'ramy-test',
  'Authorization': 'Bearer {{token_key}}' // Replace 'xxxxxx' with your token key 
};

// Path to your file
const filePath = '/users/UserName/Documents/Jobs/File_name.csv';

// Creating a readable stream and interface to read file line by line
const readInterface = readline.createInterface({
  input: fs.createReadStream(filePath),
  output: process.stdout,
  console: false
});

let index = 0;

// Reading lines from the file
readInterface.on('line', function(line) {
  // API Call
  const jobId = line.trim();
  const url = `${baseUrl}${teamId}/jobs/${jobId}/cancel`; // This is the main API call pulling from the URL const baseUrl. 

  axios.delete(url, { headers: headers })
    .then(response => {
      console.log(`Request ${index + 1} for team ID ${teamId} and job ID ${jobId} completed successfully.`);  // Standard successful message. 
      index += 1;
    })
    .catch(error => {
      console.error(`Request ${index + 1} for team ID ${teamId} and job ID ${jobId} failed with error:`, error);
      index += 1;
    });
});
