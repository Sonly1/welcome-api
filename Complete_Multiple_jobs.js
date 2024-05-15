const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Define your base API endpoint
const baseUrl = 'https://{{endpoint}}/api/v3/teams/';

// Define the teamId
const teamId = '{{team_ID}}';

// Define the headers for your request
const headers = {
  'accept': '*/*',
  'parsable-custom-touchstone': 'test', // Give a random name 
  'Authorization': 'Bearer {{auth token}}' // Replace 'xxxxxx' with your token
};

// Path to your file
const filePath = '/users/ramy.kader/Documents/Complete_jobs.csv';

// Creating a readable stream and interface to read file line by line
const readInterface = readline.createInterface({
  input: fs.createReadStream(filePath),
  output: process.stdout,
  console: false
});

let index = 0;

// Reading lines from the file
readInterface.on('line', function(line) {
  const jobId = line.split(',')[0].trim(); // This is the new part
  const url = `${baseUrl}${teamId}/jobs/${jobId}?complete`;

  axios.delete(url, { headers: headers })
    .then(response => {
      console.log(`Request ${index + 1} for team ID ${teamId} and job ID ${jobId} completed successfully.`);
      index += 1;
    })
    .catch(error => {
      console.error(`Request ${index + 1} for team ID ${teamId} and job ID ${jobId} failed with error:`, error.response ? error.response.data : error.message);
      index += 1;
    });
});
;
