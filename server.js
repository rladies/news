'use strict';

const express = require('express');
const app = express();
const dummyData = require('./public/demo.json')

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
    //CORS
    res.header("Access-Control-Allow-Origin" , "*");
    res.header("Access-Control-Allow-Methods" , "GET");
    res.header("Access-Control-Allow-Headers" , "Origin, X-Requested-With, Content-Type, Accept");
    //RESPONSE
    res.send(JSON.stringify(dummyData))
    
    console.log(`welcome to my API !
    - start: ${start}
    - end: ${end}
    - size: ${size}
    - page: ${page}`)
    
    
})

app.listen(port, ()=> {
    console.log(`server is on port ${port}`)
})