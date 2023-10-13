const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://tag:9LcyyBxiPKRXScPW@cluster0.jvqibpv.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db('tag').collection('products');

    // >>>>>>>>>>>>> All Products EndPoint
    app.get('/products', async (req, res) => {
      try {
        const result = await productCollection.find().toArray();
        res.send(result)
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }

    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// EndPoint
app.get('/', (req, res) => {
  res.send('tag Server is Running')
})


app.listen(port, () => {
  console.log(`hey dev! your Server is runing on port ${port}`);
})