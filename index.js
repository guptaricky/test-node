const express = require('express')
const app = express()

const fs = require('fs');
const path = require('path');
const port = 5000
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const axios = require('axios');
const YAML = require('yamljs');
const { FTPClient } = require('basic-ftp');



app.use(bodyParser.json());

// const swaggerOptions = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "My API",
//             version: "1.0.0",
//             description: "API documentation"
//         },
//         servers: [{

//             url: "http://localhost:5000",
//             description: "Local server"

//         }]
//     },

//     apis: ["*.js"], // Path to the API docs
// }

// Load Swagger YAML file
const swaggerDocument = YAML.load('./swagger.yaml'); // Path to the swagger.yaml file

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors())



const webRoutes = require("./routes");
app.use(webRoutes);

// app.use(express.static(path.join(__dirname, "public")));


app.get('/fetch-and-convert', async (req, res) => {
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
        const tempFilePath = path.join(__dirname, 'comments.xlsx');
        XLSX.writeFile(workbook, tempFilePath);

        // FTP upload process
        const client = new FTPClient();
        await client.access({
            host: 'ftp.remote-server.com',
            user: 'username',
            password: 'password',
            secure: true
        });

        await client.uploadFrom(tempFilePath, 'comments.xlsx'); // Upload the file
        await client.close(); // Close FTP connection

        res.json({ message: 'File uploaded successfully!' });

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath); // Delete the temporary file

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch data or generate/upload Excel file.' });
    }
});



app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`)
})