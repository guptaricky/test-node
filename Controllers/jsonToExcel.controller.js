const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FTPClient = require('basic-ftp');

const convertJsonToExcel = async(req, res) => {
    try {
        // Fetch data from the external API
        const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
        const jsonData = response.data;

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            return res.status(400).json({ error: 'No data found from the API.' });
        }
        // Convert JSON data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(jsonData);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Comments');

        // Write workbook to a temporary file
        const tempFilePath = path.join(__dirname, `comments_${Date.now()}.xlsx`);
        XLSX.writeFile(workbook, tempFilePath);

        // FTP upload process
        const client = new FTPClient.Client();
        try {
            await client.access({
                host: 'ftp.remote-server.com',
                user: 'username',
                password: 'password',
                secure: true
            });

            await client.uploadFrom(tempFilePath, 'comments.xlsx'); // Upload the file
            await client.close(); // Close FTP connection
        } catch (ftpError) {
            console.error('FTP Error:', ftpError);
            throw new Error('FTP Upload Failed');
        }


        res.json({ message: 'File uploaded successfully!' });

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath); // Delete the temporary file

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch data or generate/upload Excel file.' });
    }
};

module.exports = convertJsonToExcel;