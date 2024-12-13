const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const axios = require('axios');


const app = express();
const PORT = process.env(NODE_PORT);

app.use(bodyParser.json());

app.post('/convert-json-to-excel', async (req, res) => {
    // const jsonData = req.body;

    const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
    const jsonData = response.data;

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        return res.status(400).json({ error: 'Invalid JSON data. Expecting an array of objects.' });
    }

    try {
        const worksheet = XLSX.utils.json_to_sheet(jsonData);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="output.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('Error creating Excel file:', error);
        res.status(500).json({ error: 'Failed to create Excel file.' });
    }
});



