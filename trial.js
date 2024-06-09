const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('./config');
const path = require('path');

const app = express();
let db;

async function connectToDatabase() {
  const client = new MongoClient(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(config.dbName);
    await main();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'backend')));

app.get('/frontend', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend.html'));
});

// Handle signup form submission
app.post('/frontend', async (req, res) => {

  const ArtistData = req.body;
  const { city } = ArtistData;
  try {
    // Insert the artist data into the appropriate collection based on the city
    let collectionName;
    switch (city.toLowerCase()) {
      case 'lahore':
        collectionName = 'insertMakeupArtistsByCityLahore';
        break;
      case 'karachi':
        collectionName = 'insertMakeupArtistsByCityKarachi';
        break;
      case 'islamabad':
        collectionName = 'insertMakeupArtistsByCityIslamabad';
        break;
      default:
        return res.status(400).json({ error: 'Invalid city provided' });
    }
    const userCollection = db.collection(collectionName);
    await userCollection.insertOne(ArtistData);
    res.status(201).json({ message: 'User signed up successfully!' });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch artists by city with optional price filtering
app.get('/artists/city/:cityName', async (req, res) => {
  const { cityName } = req.params;
  const maxPrice = parseInt(req.query.maxPrice, 10);
  const minPrice = parseInt(req.query.minPrice, 10);
  try {
    const query = {};
    if (!isNaN(minPrice)) {
      query.minPrice = { $gte: minPrice };
    }
    if (!isNaN(maxPrice)) {
      query.maxPrice = { $lte: maxPrice };
    }
    const collectionName = `insertMakeupArtistsByCity${cityName.charAt(0).toUpperCase() + cityName.slice(1)}`;
    const artists = await db.collection(collectionName).find(query).toArray();
    res.json(artists);
  } catch (error) {
    console.error('Error fetching makeup artists by city:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/artists/:city/filter/:range', async (req, res) => {
  const { city, range } = req.params;
  try {
    const [minPrice, maxPrice] = range.split('-').map(Number);

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ error: 'Invalid price range provided' });
    }

    const query = {
      $or: [
        { minPrice: { $gte: minPrice, $lte: maxPrice } },
        { maxPrice: { $gte: minPrice, $lte: maxPrice } }
      ]
    };

    const cityFormatted = city.charAt(0).toUpperCase() + city.slice(1);
    const collectionName = `insertMakeupArtistsByCity${cityFormatted}`;
    console.log(`Querying collection: ${collectionName} with query:`, query); // Debug log

    const artists = await db.collection(collectionName).find(query).toArray();
    res.json(artists);
  } catch (error) {
    console.error('Error filtering makeup artists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  connectToDatabase();
});

async function main() {
  await dropAllCollections(db);
  await insertArtists(db);
}

async function dropAllCollections(db) {
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.drop();
  }
  console.log('All collections dropped');
}

async function insertArtists(db) {
  const citiesCollection = db.collection('cities');
  const insertMakeupArtistsByCityLahoreCollection = db.collection('insertMakeupArtistsByCityLahore');
  const insertMakeupArtistsByCityKarachiCollection = db.collection('insertMakeupArtistsByCityKarachi');
  const insertMakeupArtistsByCityIslamabadCollection = db.collection('insertMakeupArtistsByCityIslamabad');

  await citiesCollection.insertMany([
    { cityId: 1, cityName: 'Lahore' },
    { cityId: 2, cityName: 'Karachi' },
    { cityId: 3, cityName: 'Islamabad' },
  ]);

  await insertMakeupArtistsByCityLahoreCollection.insertMany([
    { artistID: "1", saloonName: "Beauty Belle", address: "456 Park Avenue", phoneNumber: "0312-9876543", instagramID: "beauty_belle", specialization: "Fashion Makeup", gender: "Female", servicesFor: ["Female", "Male"], serviceType: "SALOON", description: "Offering trendy and artistic makeup for fashion shoots and events.", availabilityDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], maxPrice: 7000, minPrice: 3000, userid: "2", cityId: "1" },
    { artistID: "2", saloonName: "Sleek Beauty Bar", address: "321 High Street", phoneNumber: "0311-9876543", instagramID: "sleek_beauty_bar", specialization: "Party Makeup", gender: "Female", servicesFor: ["Female"], serviceType: "SALOON", description: "Creating stunning party makeup looks for all occasions.", availabilityDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"], maxPrice: 6500, minPrice: 3000, userid: "6", cityId: "1" },
    { artistID: "3", saloonName: "Glamour Zone", address: "789 Luxury Road", phoneNumber: "0321-1234567", instagramID: "glamour_zone", specialization: "Bridal Makeup", gender: "Female", servicesFor: ["Female"], serviceType: "SALOON", description: "Expert bridal makeup services to make your big day perfect.", availabilityDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], maxPrice: 15000, minPrice: 8000, userid: "10", cityId: "1" }
  ]);

  await insertMakeupArtistsByCityKarachiCollection.insertMany([
    { artistID: "33", saloonName: "Star Glam", address: "101 Sunset Boulevard", phoneNumber: "0301-1234567", instagramID: "star_glam", specialization: "Bridal Makeup", gender: "Female", servicesFor: ["Female"], serviceType: "SALOON", description: "Expert bridal makeup to make your special day unforgettable.", availabilityDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], maxPrice: 15000, minPrice: 8000, userid: "33", cityId: "2" },
    { artistID: "34", saloonName: "Chic Looks", address: "202 Fashion Street", phoneNumber: "0302-2345678", instagramID: "chic_looks", specialization: "Fashion Makeup", gender: "Female", servicesFor: ["Female", "Male"], serviceType: "SALOON", description: "Stylish and trendy makeup for fashion events and photoshoots.", availabilityDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], maxPrice: 9000, minPrice: 4000, userid: "34", cityId: "2" },
    { artistID: "35", saloonName: "Glam Hub", address: "303 Glam Avenue", phoneNumber: "0303-3456789", instagramID: "glam_hub", specialization: "Party Makeup", gender: "Female", servicesFor: ["Female"], serviceType: "SALOON", description: "Creating bold and beautiful looks for all your parties.", availabilityDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"], maxPrice: 7000, minPrice: 3000, userid: "35", cityId: "2" }
  ]);

  await insertMakeupArtistsByCityIslamabadCollection.insertMany([
    { artistID: "18", saloonName: "Iqbals Magic", address: "456 Park Avenue", phoneNumber: "0312-9876543", instagramID: "beauty_belle", specialization: "Fashion Makeup", gender: "Female", servicesFor: ["Female", "Male"], serviceType: "SALOON", description: "Offering trendy and artistic makeup for fashion shoots and events.", availabilityDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], maxPrice: 7000, minPrice: 3000, userid: "2", cityId: "3" },
    { artistID: "19", saloonName: "Sleek Beauty Bar", address: "321 High Street", phoneNumber: "0311-9876543", instagramID: "sleek_beauty_bar", specialization: "Party Makeup", gender: "Female", servicesFor: ["Female"], serviceType: "SALOON", description: "Creating stunning party makeup looks for all occasions.", availabilityDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"], maxPrice: 6500, minPrice: 3000, userid: "6", cityId: "3" },
    { artistID: "20", saloonName: "Glamour Zone", address: "789 Luxury Road", phoneNumber: "0321-1234567", instagramID: "glamour_zone", specialization: "Bridal Makeup", gender: "Female", servicesFor: ["Female"], serviceType: "SALOON", description: "Expert bridal makeup services to make your big day perfect.", availabilityDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], maxPrice: 15000, minPrice: 8000, userid: "10", cityId: "3" }
  ]);
}
