const fs = require('fs');
const axios = require('axios');

const overpassUrl = 'https://overpass-api.de/api/interpreter';
const overpassQuery = `
[out:json];
area["name"="Kiev"]->.city;
relation(area.city)["admin_level"="6"];
out;
`;

const filePath = 'districts_cities.json';

const writeStream = fs.createWriteStream(filePath);

axios.get(overpassUrl, {
  params: {
    data: overpassQuery
  },
  responseType: 'stream' // Use stream response type
})
  .then(response => {
    // Pipe the response stream to the write stream
    response.data.pipe(writeStream);

    // Handle completion of writing
    writeStream.on('finish', () => {
      console.log(`Data written to file ${filePath} successfully.`);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });