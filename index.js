require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./app/router');
const multer = require('multer');
const bodyParser = multer();


const PORT = process.env.PORT || 3000;

const app = express();

app.use( bodyParser.none() );

app.use(cors());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.use(router);

app.listen(PORT, _ => console.log(`Listening on http://localhost:${PORT}`));