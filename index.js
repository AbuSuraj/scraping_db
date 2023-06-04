const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const puppeter = require('puppeteer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
// let news;
app.get('/', (req, res) =>{
    res.send('simple node server running')
});

app.use(cors());

app.listen(port, () =>{
    console.log(`simple node server listening on ${port}`)
})

const uri = "mongodb+srv://scraper:Nc3XiycF4rApJLiv@cluster0.sc93kvm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// scraping
async function runNews() {
    const browser = await puppeter.launch();
    const page = await browser.newPage();
    await page.goto('https://prothomalo.com/');

    const text = await page.evaluate(() => document.body.innerText);

   const  headline = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#container .headline-title'), (e) => ({
            title: e.querySelector('span').innerText,
        })))

        const date = new Date();
        const newsDate = JSON.stringify(date).slice(1,11);
        console.log( newsDate);

        const news = { newsDate,headline}

    try { 
        console.log('news are ', news);
        const newsCollection = client.db('scraping_db').collection('prothom-alo');
        // const result = await newsCollection.insertOne(news);
        // console.log(result);
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.get("/news", async (req, res) => {
          const query = {};
          const cursor = newsCollection.find(query);
          const news = await cursor.sort({ newsDate: -1 }).toArray();
          res.send(news);
        });


        app.post("/addNews", async (req, res) => {
          const newst = news
          const result = await newsCollection.insertOne(newst);
          res.send(result);
        });
        } finally { 
          // await client.close();
        }
        await browser.close();
      }
      runNews();
      
      // getting date wise news



// app.get('/news', (req, res) =>{
//     res.send(news)
// })



 
// Create a MongoClient with a MongoClientOptions object to set the Stable API version



// async function run() {
//    const news =   runNews()
//    .then(res => res.json())
//    .then(data => console.log(data));

//   try { 
//     console.log('news are ', news);
//     // await client.connect();
//     // await client.db("admin").command({ ping: 1 });
//     const newsCollection = client.db('scraping_db').collection('prothom-alo-headlines');
//     const result = await newsCollection.insertOne(user);
//     console.log(result);
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     // app.post('/news',(req,res) =>{

//     // })
//   } finally { 
//     // await client.close();
//   }
// }
// run().catch(console.dir);
