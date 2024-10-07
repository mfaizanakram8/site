
require('@babel/register'); 


require('./helpers/css.js'); 


const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('Welcome to your Node.js website!');
});


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
