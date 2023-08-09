const fs = require('fs');

// Step 1: Open a file with multiline text
const filename = 'multiline.txt';

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Step 2: Split the multiline text into an array of strings
  const lines = data.split('\n');

  // Step 3: Wrap each element in double quotes and add spaces
  const wrappedLines = lines.map(line => `" ${line.trim()} "`);

  // Step 4: Join the wrapped lines with a single plus symbol and '\r\n' separator
  const result = wrappedLines.join(' + \r\n');

  // Save the result to the "result.txt" file
  const resultFilename = 'result.txt';
  fs.writeFile(resultFilename, result, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to the file:', err);
      return;
    }
    console.log(`Result saved to ${resultFilename}`);
  });
});