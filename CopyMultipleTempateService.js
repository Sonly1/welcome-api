const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// API endpoint and file path setup
const apiEndpoint = 'https://kbua6l2pwl.execute-api.us-west-2.amazonaws.com/v2/CopyTemplateService';
const filePath = '/users/ramy.kader/Documents/Template_id.csv';

// Read the CSV and process in chunks
const readCSVandProcessInBatches = async () => {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    console: false
  });

  const templateIds = [];
  const batchSize = 10; // Define batch size

  for await (const line of readInterface) {
    const cleanedLine = line.split(',')[0].trim();
    if (cleanedLine) {
      templateIds.push(cleanedLine);
      if (templateIds.length >= batchSize) {
        await sendTemplates(templateIds);
        templateIds.length = 0; // Clear the array for the next batch
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30-second delay
      }
    }
  }

  if (templateIds.length > 0) {
    await sendTemplates(templateIds); // Process the last batch if any
  }
};

const sendTemplates = async (templateIds) => {
  const payload = {
    template_ids: templateIds,
    "applet_ids": [],
    "datasheet_set_ids": [],
    "job_role_names": [],
    "use_previous_session_uuids": true,
    "include_template_procedure_types": true,
    "include_template_input_triggers": true,
    "include_template_applets": true,
    "include_template_refsheets": true,
    "src_team_id": "01f00ddc-ce75-4394-b79f-281539850354",
    "src_auth_token": "xxxxxxxx",
    "src_api_base": "https://api.us-west-2.parsable.net",
    "dest_team_id": "7ab36eae-72c4-4907-a9f3-1a1d9879f12e",
    "dest_auth_token": "xxxxxx",
    "dest_api_base": "https://api.us-west-2.parsable.net",
    "should_publish_template": true,
    "should_copy_attributes": true,
    "include_metadata_values": true
  };

  try {
    const response = await axios.post(apiEndpoint, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

// Start the process
readCSVandProcessInBatches();