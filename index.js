const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k6poawy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const bookCollection = client.db('bookStore').collection('books');
    const bookReviewCollection = client.db('bookStore').collection('booksReviews');

    // find all data
    app.get('/books', async (req, res) => {
      const query = {};
      const cursor = bookCollection.find(query);
      const books = await cursor.toArray();
      res.send(books);
    });
    app.get('/reviews', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = bookReviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    // find special data
    app.get('/books/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const book = await bookCollection.findOne(query);
      res.send(book);
    });

    // post api
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await bookReviewCollection.insertOne(review);
      res.send(result);
    });

    // Delete API
    app.delete('/reviews/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await bookReviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    //
  }
}
run().catch((error) => console.log(error));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
