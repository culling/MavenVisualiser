const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse text bodies for maven output
app.use(express.text({ limit: '10mb' }));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Maven Visualiser running at http://localhost:${PORT}`);
});