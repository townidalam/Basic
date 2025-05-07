const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serve all files from root

const reportsFile = path.join(__dirname, 'reports.txt');

// Submit report endpoint
app.post('/submit-report', async (req, res) => {
    const { ip, message, dateTime } = req.body;
    const report = { ip, message, dateTime };

    try {
        await fs.appendFile(reportsFile, JSON.stringify(report) + '\n', 'utf8');
        console.log('Report Saved:', report);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error saving report:', err);
        res.status(500).json({ error: 'Failed to save report' });
    }
});

// Fetch reports endpoint
app.get('/get-reports', async (req, res) => {
    try {
        const data = await fs.readFile(reportsFile, 'utf8');
        const reports = data.trim().split('\n').map(line => JSON.parse(line));
        res.json(reports);
    } catch (err) {
        if (err.code === 'ENOENT') res.json([]); // File doesn’t exist yet
        else {
            console.error('Error reading reports:', err);
            res.status(500).json({ error: 'Failed to fetch reports' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});