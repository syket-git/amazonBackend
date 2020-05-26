const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;

app.get('/', (req, res) => {
  res.send('Yes its working');
});

app.post('/addProducts', (req, res) => {
  const product = req.body;
  console.log(product);
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db('amazon').collection('products');
    collection.insertMany(product, (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    //client.close();
  });
});

app.post('/placeOrder', (req, res) => {
  const order = req.body;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db('amazon').collection('orders');
    collection.insertOne(order, (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        console.log(result.ops[0]);
        res.send(result.ops[0]);
      }
    });
    //client.close();
  });
});

app.get('/products', (req, res) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db('amazon').collection('products');
    collection.find().toArray((err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.send(result);
      }
    });
    //client.close();
  });
});

app.get('/product/:id', (req, res) => {
  const id = req.params.id;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db('amazon').collection('products');
    collection.find({ id: parseInt(id) }).toArray((err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.send(result[0]);
      }
    });
    //client.close();
  });
});


app.get('/orders/:email', (req, res) => {
  const email = req.params.email;
  console.log(email)
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db('amazon').collection('orders');
    collection.find({ email }).toArray((err, documents) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    //client.close();
  });
});


const PORT = process.env.PORT || 4400;
app.listen(PORT, () => console.log('Listening to port 4400'));
