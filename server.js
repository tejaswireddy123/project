const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/portfolio', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Schema and Model
const PortfolioSchema = new mongoose.Schema({
    about: String,
    skills: [String],
    projects: [{ title: String, description: String, link: String, image: String }],
});
const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

// Routes
app.get('/portfolio', async (req, res) => {
    const portfolio = await Portfolio.findOne();
    res.json(portfolio);
});

app.post('/portfolio', async (req, res) => {
    const newPortfolio = new Portfolio(req.body);
    await newPortfolio.save();
    res.status(201).json(newPortfolio);
});

app.put('/portfolio', async (req, res) => {
    const portfolio = await Portfolio.findOneAndUpdate({}, req.body, { new: true });
    res.json(portfolio);
});

app.listen(5000, () => console.log('Server running on port 5000'));
