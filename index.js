const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.bugcd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/* 
client.connect(err => {
   
    // perform actions on the collection object
    console.log('connected');
  }); */
  async function run() {
      try{
        await client.connect();
        const toDoLists = client.db("to_do_app").collection("to_do_lists");
        app.post('/do_lists', async(req,res)=>{
            const list = req.body;
            const result = await toDoLists.insertOne(list);
            res.send(result);
        });
        app.get('/lists', async(req,res)=>{
            const result = await toDoLists.find().toArray();
            res.send(result);
        });
        app.delete(`/list/:title`, async(req,res)=>{
           const title = req.params.title;
           const filter = {title};
           const result = await toDoLists.deleteOne(filter);
           res.send(result);
        })
      }finally{

      }
  }
  run().catch(console.dir);

/* http://localhost:4000/ */
app.get("/", async (req, res) => {
  res.send("to do app is running");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
