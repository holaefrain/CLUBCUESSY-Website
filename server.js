const express = require('express');
const app = express();
const path = require('path');

// Serve all files in this folder
app.use(express.static(__dirname));

// Default route → send index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
