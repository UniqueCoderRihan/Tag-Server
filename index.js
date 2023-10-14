const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const usersCollection = client.db('tag').collection('users');

    // >>>>>>>>>>>>> All Products EndPoint <<<<><><><>

    app.get('/products', async (req, res) => {
      try {
        const result = await productCollection.find().toArray();
        res.send(result)
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    })
    // product details with dynamic route
    app.get('/product/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productCollection.findOne(query);
        console.log(result);
        res.send(result);
      }
      catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
      }
    })

    // Sorting High to Low
    app.get('/products/sort/high-to-low', async (req, res) => {
      try {
        const result = await productCollection.find().sort({ price: -1 }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // low to high shorting
    app.get('/products/sort/low-to-high', async (req, res) => {
      try {
        const result = await productCollection.find().sort({ price: 1 }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Create Index by Search Text
    const indexKeys = { productName: 1, category: 1 };
    const indexOptions = { productName: 'productNamecategory' };
    const result = await productCollection.createIndex(indexKeys, indexOptions);

    app.get('/searched/:text', async (req, res) => {
      try {
        const searchText = req.params.text;

        const result = await productCollection.find({
          $or: [
            { productName: { $regex: searchText, $options: "i" } },
            { category: { $regex: searchText, $options: "i" } },
          ],
        }).toArray();
        res.send(result)
      }
      catch (error) {
        res.status(500).json({ error: 'Internal server error' })
      }
    })

    // User Endpoint >>>>>>>
    // User Post On Database.
    app.post('/users', async (req, res) => {
      try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result)
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
      }
    })

    //  >>>>>>>>>>>>>>>>>>>>>> Add Product >>>>>>>
    app.post('/addProduct', async (req, res) => {
      try {
        const item = req.body;
        const result = await productCollection.insertOne(item);
        res.send(result)
      }
      catch (error) {
        res.status(500).json({ error: 'Internal server error' })
      }
    })

    // find User Product by Currrent User info
    app.get('/my-product', async (req, res) => {
      try {
        let query = {};
        if (req.query?.email) {
          query = { sellerEmail: req.query?.email }
        }
        const result = await productCollection.find(query).toArray();
        res.send(result)
      }
      catch (error) {
        res.status(500).json({ error: 'Internal server error' })
      }
    })

    // update Product >>>>>>>>>>>
    app.post('/updateProduct', async (req, res) => {
      const updatedProduct = req.body;

      try {
        const filter = { _id: updatedProduct._id };
        const result = await productCollection.updateOne(filter, { $set: updatedProduct });

        if (result.modifiedCount === 1) {
          res.json({ acknowledged: true });
        } else {
          res.json({ acknowledged: false });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });


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