const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json());

app.get('/', (req,res)=>{
res.send("Selamat Datang di Webhook")
});

// Webhook endpoint
app.get('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);

    // Execute the shell command or script
    const command = process.env.COMMAND; // Replace with your script/command

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return res.status(500).json({ error: 'Execution failed' });
        }
        if (stderr) {
            console.error(`Standard Error: ${stderr}`);
            return res.status(500).json({ error: 'Execution error' });
        }
        const cmd = exec(command);
        cmd.stdout.on('data', (data)=>{
            console.log(`${data}`);
        })
        res.status(200).json({ message: 'Command executed successfully'});
        // res.status(200).json({ message: 'Command executed successfully', output: stdout });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Webhook server is running on http://localhost:${port}`);
});