/*
 * Servicio backend Express + MongoDB (Mongoose) para la aplicación
 * de reseñas de concesionarios "Best Cars".
 *
 * Endpoints:
 *  GET  /fetchReviews                    -> todas las reseñas
 *  GET  /fetchReviews/dealer/:id          -> reseñas de un concesionario
 *  GET  /fetchDealers                     -> todos los concesionarios
 *  GET  /fetchDealers/:state              -> concesionarios por estado
 *  GET  /fetchDealer/:id                  -> un concesionario por id
 *  POST /insert_review                    -> inserta una nueva reseña
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Reviews = require('./models/review');
const Dealerships = require('./models/dealership');

const reviews_data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/reviews.json'), 'utf8')
);
const dealerships_data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/dealerships.json'), 'utf8')
);

mongoose
  .connect('mongodb://db/dealershipsDB', {})
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      await Reviews.deleteMany({});
      await Reviews.insertMany(reviews_data.reviews);
      await Dealerships.deleteMany({});
      await Dealerships.insertMany(dealerships_data.dealerships);
      console.log('Data seeded successfully');
    } catch (error) {
      console.error('Error seeding data', error);
    }
  })
  .catch((error) => console.log('MongoDB connection error:', error));

app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API for Best Cars Dealerships');
});

// Obtener todas las reseñas
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Obtener las reseñas de un concesionario en particular
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Obtener todos los concesionarios
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Obtener concesionarios por estado
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({ state: req.params.state });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Obtener un concesionario por id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const documents = await Dealerships.find({ id: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Insertar una nueva reseña
app.post('/insert_review', async (req, res) => {
  const data = req.body;
  const documents = await Reviews.find().sort({ id: -1 });
  let new_id = documents.length > 0 ? documents[0].id + 1 : 1;

  const review = new Reviews({
    id: new_id,
    name: data.name,
    dealership: data.dealership,
    review: data.review,
    purchase: data.purchase,
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: data.car_year,
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
