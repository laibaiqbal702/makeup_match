const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb+srv://laiba:pD05FJRtVNwvpBAF@artist.mykkrog.mongodb.net/artist?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Importing Models
const users = require('./models/UserModel'); 
const MakeupArtist = require('./models/ArtistModel'); 

// Middleware
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
    res.send("Server Connection is successful");
});

// Starting the server
http.listen(3000, () => {
    console.log('Server is running on port 3000');
});