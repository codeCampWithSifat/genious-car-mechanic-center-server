const express = require("express");
const app = express();
const port = process.env.PORT || 5000 ;
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;


// set all the middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.SECRET_KEY}:${process.env.SECRET_HASH}@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const database = client.db("geniousCar");
        const serviceCollection = database.collection("service");
        const orderCollection = client.db("geniousCar").collection("order");

        // load all the data
        app.get("/service", async(req,res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        // load a single data from the user interface
        app.get("/service/:id", async(req,res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })

        // load a single data from the user interface
        app.post('/service', async(req,res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        // deleted one data from the user interface
        app.delete("/service/:id", async(req,res) => {
            const id = req.params.id ;
            const query = {_id : ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });

        // order collection api 

        app.post("/order", async(req,res) => {
            const order = req.body ;
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.send(result)
        });

        app.get("/order", async(req,res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor =  orderCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);

        })

    } 
    finally{

    }
}

run().catch(console.dir);


app.get("/", (req,res) => {
    res.send("Hello Genious Car Mechanic Center From Bangladesh ")
})


app.listen(port, () => {
    console.log(`Listening To The Port ${port} Successfully`)
})