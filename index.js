const express = require('express');
const puppeter = require('puppeteer');
const app = express();
const port = process.env.PORT || 5000;
let news;
app.get('/', (req, res) =>{
    res.send('simple node server running')
});

app.listen(port, () =>{
    console.log(`simple node server listening on ${port}`)
})

// scraping
async function run() {
    const browser = await puppeter.launch();
    const page = await browser.newPage();
    await page.goto('https://en.prothomalo.com/');

    const text = await page.evaluate(() => document.body.innerText);



     news = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#container .headline-title'), (e) => ({
            title: e.querySelector('span').innerText,
        })))
    console.log(news);
    await browser.close();
}
run();

app.get('/news', (req, res) =>{
    res.send(news)
})