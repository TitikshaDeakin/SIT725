const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "public" folder
app.use(express.static('public'));

// Example GET endpoint: Add two numbers
app.get('/add', (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if (isNaN(a) || isNaN(b)) {
        return res.status(400).send('Invalid numbers');
    }

    const sum = a + b;
    res.send(`The sum of ${a} and ${b} is ${sum}`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
