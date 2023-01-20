const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(express.json());

//database setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.t0pnxex.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect() {
    try {
        await client.connect();
        console.log('database is connected')
    } catch (error) {
        console.log(error.name, error.message);
    }
}

dbConnect();

//Collections
const StoredTasks = client.db("myApp").collection("StoredTasks");

//post data
app.post('/addTasks', async (req, res) => {
    try {
        const storedTask = req.body;
        const result = await StoredTasks.insertOne(storedTask);

        if (result.insertedId) {
            res.send({
                success: true,
                message: `${storedTask.task} is successfully tracked`
            })
        }
        else {
            res.send({
                success: false,
                message: `something went wrong. Please try again later`
            })
        }

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
});

//task view
app.get('/taskView', async (req, res) => {
    try {
        const query = {};
        const AllTasks = await StoredTasks.find(query).sort({ status: 1 }).toArray();
        res.send({
            success: true,
            data: AllTasks
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

//endpoint route test
app.get('/', async (req, res) => {
    res.send('my_app server is running');
});

app.listen(port, () => {
    console.log(`my_app server is running on ${port}`);
});
