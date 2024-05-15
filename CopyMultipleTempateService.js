const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// API endpoint and file path setup
const apiEndpoint = 'https://{{endpoint}}/{{version}}/CopyTemplateService';
const filePath = '/users/Username/Documents/file_name.csv'; //Make sure it's UFT-8 file and no column header 

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
    "src_team_id": "{{source_id}}",
    "src_auth_token": "{{token_key}}",
    "src_api_base": "{{source_endpoint_Api}}t",
    "dest_team_id": "{{target_id}}",
    "dest_auth_token": "{{token_key}}",
    "dest_api_base": "{{target_api}}",
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
