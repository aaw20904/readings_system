const axios = require('axios');
const fs=require("fs");

const overpassUrl = 'https://overpass-api.de/api/interpreter';
const overpassQuery = `
  [out:json];
  area["ISO3166-1"="UA"][admin_level=2]->.country;
  relation["admin_level"="6"](area.country);
  out;
`;

axios.get(overpassUrl, {
  params: {
    data: overpassQuery
  }
})
.then(response => {
    const features = response.data.elements;
     // Convert data to JSON string
    const jsonData = JSON.stringify(features, null, 2);
    
    // Define the file path
    const filePath = 'regions_usa.json';
    // Create a write stream
    const writeStream = fs.createWriteStream(filePath);
     // Write the JSON data to the file using the stream
    writeStream.write(jsonData);
    // Close the stream
    writeStream.end();
    
})
.catch(error => {
console.error('Error fetching data:', error);
});