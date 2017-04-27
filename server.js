'use strict';

const express = require('express');
const app = express();

const port = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
});

app.get('/api/v1/news', (req, res)=> {
    let start = req.query.start || "by default"
    let end = req.query.end || "by default"
    let size = req.query.size || "by default"
    let page = req.query.page || "by default"
    res.send(`welcome to my API !
    start: ${start}
    end: ${end}
    size: ${size}
    page: ${page}`)
    
})

app.listen(port, ()=> {
    console.log(`server is on port ${port}`)
})